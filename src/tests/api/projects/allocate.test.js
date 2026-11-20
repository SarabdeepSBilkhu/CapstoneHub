/**
 * Integration tests: /api/projects/allocate route
 * Verifies team allocation: accepts chosen team, rejects others.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/projects/allocate/route';
import { prisma } from '@/lib/prisma';

vi.mock('@/lib/auth', () => ({ getCurrentUser: vi.fn() }));
import { getCurrentUser } from '@/lib/auth';

const makeRequest = (body) => ({ json: async () => body });

describe('POST /api/projects/allocate', () => {
  beforeEach(() => vi.clearAllMocks());

  it('allocates a team and rejects all others', async () => {
    getCurrentUser.mockResolvedValue({ id: 'usr_admin_1', role: 'ADMIN' });
    prisma.projectApplication.findUnique.mockResolvedValue({
      id: 'app_001',
      teamId: 'team_alpha',
      projectId: 'smart-campus-nav',
    });
    prisma.projectApplication.updateMany.mockResolvedValue({ count: 2 });
    prisma.projectApplication.update.mockResolvedValue({ id: 'app_001', status: 'ACCEPTED' });
    prisma.project.update.mockResolvedValue({
      id: 'smart-campus-nav',
      status: 'ALLOCATED',
      allocatedTeamId: 'team_alpha',
    });

    const res = await POST(makeRequest({
      projectId: 'smart-campus-nav',
      selectedApplicationId: 'app_001',
    }));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.project.status).toBe('ALLOCATED');

    // Rejected all OTHER applications for this project
    expect(prisma.projectApplication.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ id: { not: 'app_001' } }),
        data: { status: 'REJECTED' },
      })
    );
    // Accepted the selected application
    expect(prisma.projectApplication.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { status: 'ACCEPTED' } })
    );
  });

  it('returns 403 for STUDENT role', async () => {
    getCurrentUser.mockResolvedValue({ id: 'usr_student_1', role: 'STUDENT' });

    const res = await POST(makeRequest({ projectId: 'x', selectedApplicationId: 'y' }));
    expect(res.status).toBe(403);
  });

  it('returns 400 when selectedApplicationId is missing', async () => {
    getCurrentUser.mockResolvedValue({ id: 'usr_admin_1', role: 'ADMIN' });

    const res = await POST(makeRequest({ projectId: 'smart-campus-nav' }));
    expect(res.status).toBe(400);
  });

  it('returns 404 when application does not exist', async () => {
    getCurrentUser.mockResolvedValue({ id: 'usr_admin_1', role: 'ADMIN' });
    prisma.projectApplication.findUnique.mockResolvedValue(null);

    const res = await POST(makeRequest({
      projectId: 'smart-campus-nav',
      selectedApplicationId: 'nonexistent',
    }));
    expect(res.status).toBe(404);
  });
});
