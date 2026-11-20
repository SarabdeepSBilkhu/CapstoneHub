/**
 * Integration tests: /api/meetings/create route
 * Tests supervisor-only access and log creation.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/meetings/create/route';
import { prisma } from '@/lib/prisma';

vi.mock('@/lib/auth', () => ({ getCurrentUser: vi.fn() }));
import { getCurrentUser } from '@/lib/auth';

const makeRequest = (body) => ({ json: async () => body });

const validLog = {
  projectId: 'smart-campus-nav',
  meetingDate: '2026-11-01',
  attendees: 'Alex Chen, Maya Patel',
  discussionPoints: 'Reviewed BLE scan accuracy and discussed floor-plan SVG rendering performance.',
  actionItems: '1. Fix BLE dropout on floor 2. 2. Optimise SVG polygon rendering.',
  satisfactionRating: 4,
};

describe('POST /api/meetings/create', () => {
  beforeEach(() => vi.clearAllMocks());

  it('creates a supervisor meeting log', async () => {
    getCurrentUser.mockResolvedValue({ id: 'usr_supervisor_1', role: 'SUPERVISOR', name: 'Dr. Martinez' });
    prisma.supervisorLog.create.mockResolvedValue({
      id: 'log_001',
      ...validLog,
      supervisorId: 'usr_supervisor_1',
    });

    const res = await POST(makeRequest(validLog));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.log.id).toBe('log_001');
    expect(prisma.supervisorLog.create).toHaveBeenCalledOnce();
  });

  it('returns 403 for STUDENT role', async () => {
    getCurrentUser.mockResolvedValue({ id: 'usr_student_1', role: 'STUDENT' });

    const res = await POST(makeRequest(validLog));
    expect(res.status).toBe(403);
  });

  it('returns 403 for unauthenticated request', async () => {
    getCurrentUser.mockResolvedValue(null);

    const res = await POST(makeRequest(validLog));
    expect(res.status).toBe(403);
  });

  it('returns 400 when required fields are missing', async () => {
    getCurrentUser.mockResolvedValue({ id: 'usr_supervisor_1', role: 'SUPERVISOR' });

    const res = await POST(makeRequest({ projectId: 'smart-campus-nav' })); // missing most fields
    expect(res.status).toBe(400);
  });

  it('allows ADMIN to create a meeting log', async () => {
    getCurrentUser.mockResolvedValue({ id: 'usr_admin_1', role: 'ADMIN', name: 'Admin' });
    prisma.supervisorLog.create.mockResolvedValue({ id: 'log_002', ...validLog });

    const res = await POST(makeRequest(validLog));
    expect(res.status).toBe(200);
  });
});
