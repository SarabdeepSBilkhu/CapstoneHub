/**
 * Integration tests: /api/projects/reject-application route
 * Verifies rejection of a student cohort application.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/projects/reject-application/route';
import { prisma } from '@/lib/prisma';

vi.mock('@/lib/auth', () => ({ getCurrentUser: vi.fn() }));
import { getCurrentUser } from '@/lib/auth';

const makeRequest = (body) => ({ json: async () => body });

describe('POST /api/projects/reject-application', () => {
  beforeEach(() => vi.clearAllMocks());

  it('allows ADMIN to reject an application', async () => {
    getCurrentUser.mockResolvedValue({ id: 'usr_admin_1', role: 'ADMIN' });
    prisma.projectApplication.update.mockResolvedValue({
      id: 'app_001',
      status: 'REJECTED',
    });

    const res = await POST(makeRequest({ applicationId: 'app_001' }));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.application.status).toBe('REJECTED');
    expect(prisma.projectApplication.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'app_001' },
        data: expect.objectContaining({ status: 'REJECTED' }),
      })
    );
  });

  it('allows SUPERVISOR to reject an application', async () => {
    getCurrentUser.mockResolvedValue({ id: 'usr_supervisor_1', role: 'SUPERVISOR' });
    prisma.projectApplication.update.mockResolvedValue({
      id: 'app_002',
      status: 'REJECTED',
    });

    const res = await POST(makeRequest({ applicationId: 'app_002' }));
    expect(res.status).toBe(200);
  });

  it('returns 403 for STUDENT role', async () => {
    getCurrentUser.mockResolvedValue({ id: 'usr_student_1', role: 'STUDENT' });

    const res = await POST(makeRequest({ applicationId: 'app_001' }));
    expect(res.status).toBe(403);
  });

  it('returns 400 when applicationId is missing', async () => {
    getCurrentUser.mockResolvedValue({ id: 'usr_admin_1', role: 'ADMIN' });

    const res = await POST(makeRequest({}));
    expect(res.status).toBe(400);
  });
});
