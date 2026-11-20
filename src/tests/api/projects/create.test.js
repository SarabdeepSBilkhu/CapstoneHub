/**
 * Integration tests: /api/projects/create route
 * Verifies sponsor-only access, field validation, and DB write.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/projects/create/route';
import { prisma } from '@/lib/prisma';

vi.mock('@/lib/auth', () => ({
  getCurrentUser: vi.fn(),
}));
import { getCurrentUser } from '@/lib/auth';

const makeRequest = (body) => ({ json: async () => body });

const validProject = {
  title: 'Smart Campus Navigation',
  description: 'Multi-floor indoor navigation using BLE beacons and SVG floor maps.',
  problemStatement: 'Students and visitors struggle to navigate large multi-floor campus buildings efficiently without digital wayfinding tools.',
  requiredSkills: ['React', 'BLE', 'Node.js'],
  expectedOutcomes: 'Working BLE-based indoor nav with live floor plan SVG.',
  category: 'INDUSTRY_SPONSORED',
  ipStatus: 'CONFIDENTIAL',
  tags: ['BLE', 'IoT'],
  maxTeamSize: 4,
};

describe('POST /api/projects/create', () => {
  beforeEach(() => vi.clearAllMocks());

  it('creates a project when logged in as SPONSOR', async () => {
    getCurrentUser.mockResolvedValue({ id: 'usr_sponsor_1', role: 'SPONSOR', name: 'Elena' });
    prisma.project.create.mockResolvedValue({
      ...validProject,
      id: 'proj_new_001',
      status: 'PENDING_APPROVAL',
      sponsorId: 'usr_sponsor_1',
    });

    const res = await POST(makeRequest(validProject));
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.project.id).toBe('proj_new_001');
    expect(body.project.status).toBe('PENDING_APPROVAL');
    expect(prisma.project.create).toHaveBeenCalledOnce();
  });

  it('returns 403 for STUDENT role', async () => {
    getCurrentUser.mockResolvedValue({ id: 'usr_student_1', role: 'STUDENT' });

    const res = await POST(makeRequest(validProject));
    expect(res.status).toBe(403);
    expect(prisma.project.create).not.toHaveBeenCalled();
  });

  it('returns 403 when not logged in', async () => {
    getCurrentUser.mockResolvedValue(null);

    const res = await POST(makeRequest(validProject));
    expect(res.status).toBe(403);
  });

  it('returns 400 when required fields are missing', async () => {
    getCurrentUser.mockResolvedValue({ id: 'usr_sponsor_1', role: 'SPONSOR' });

    const res = await POST(makeRequest({ title: 'Too short' }));
    expect(res.status).toBe(400);
  });
});
