/**
 * Integration tests: /api/projects/apply route
 * Tests STUDENT cohort application submission.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/projects/apply/route';
import { prisma } from '@/lib/prisma';

vi.mock('@/lib/auth', () => ({ getCurrentUser: vi.fn() }));
import { getCurrentUser } from '@/lib/auth';

const makeRequest = (body) => ({ json: async () => body });

describe('POST /api/projects/apply', () => {
  beforeEach(() => vi.clearAllMocks());

  it('submits a competitive proposal as STUDENT', async () => {
    getCurrentUser.mockResolvedValue({ id: 'usr_student_1', role: 'STUDENT', name: 'Alex Chen' });
    prisma.team.findFirst.mockResolvedValue({ id: 'team_001', name: 'GeoPath Innovators' });
    const mockApp = {
      id: 'app_new_001',
      projectId: 'smart-campus-nav',
      teamId: 'team_001',
      proposal: 'Our team will implement BLE trilateration with sub-meter accuracy.',
      status: 'PENDING',
    };
    prisma.projectApplication.upsert.mockResolvedValue(mockApp);
    prisma.projectApplication.create.mockResolvedValue(mockApp);

    const res = await POST(makeRequest({
      projectId: 'smart-campus-nav',
      teamName: 'GeoPath Innovators',
      proposal: 'Our team will implement BLE trilateration with sub-meter accuracy.',
    }));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.application.status).toBe('PENDING');
    expect(prisma.projectApplication.upsert).toHaveBeenCalledOnce();
  });

  it('returns 403 for SPONSOR role', async () => {
    getCurrentUser.mockResolvedValue({ id: 'usr_sponsor_1', role: 'SPONSOR' });

    const res = await POST(makeRequest({
      projectId: 'smart-campus-nav',
      proposal: 'Sponsor proposal',
    }));
    expect(res.status).toBe(403);
  });

  it('returns 400 when proposal is missing', async () => {
    getCurrentUser.mockResolvedValue({ id: 'usr_student_1', role: 'STUDENT', name: 'Alex' });

    const res = await POST(makeRequest({ projectId: 'smart-campus-nav' }));
    expect(res.status).toBe(400);
  });
});
