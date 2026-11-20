/**
 * Integration tests: /api/projects/approve route
 * Verifies ADMIN-only access, approve vs. reject transitions.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/projects/approve/route';
import { prisma } from '@/lib/prisma';

vi.mock('@/lib/auth', () => ({ getCurrentUser: vi.fn() }));
import { getCurrentUser } from '@/lib/auth';

const makeRequest = (body) => ({ json: async () => body });

describe('POST /api/projects/approve', () => {
  beforeEach(() => vi.clearAllMocks());

  it('approves a project as ADMIN', async () => {
    getCurrentUser.mockResolvedValue({ id: 'usr_admin_1', role: 'ADMIN' });
    prisma.project.update.mockResolvedValue({
      id: 'smart-campus-nav',
      status: 'APPROVED',
    });

    const res = await POST(makeRequest({ projectId: 'smart-campus-nav', action: 'APPROVE' }));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.project.status).toBe('APPROVED');
    expect(prisma.project.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ status: 'APPROVED' }) })
    );
  });

  it('archives (rejects) a project as ADMIN', async () => {
    getCurrentUser.mockResolvedValue({ id: 'usr_admin_1', role: 'ADMIN' });
    prisma.project.update.mockResolvedValue({
      id: 'smart-campus-nav',
      status: 'ARCHIVED',
    });

    const res = await POST(makeRequest({ projectId: 'smart-campus-nav', action: 'REJECT' }));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.project.status).toBe('ARCHIVED');
  });

  it('returns 403 for SPONSOR role', async () => {
    getCurrentUser.mockResolvedValue({ id: 'usr_sponsor_1', role: 'SPONSOR' });

    const res = await POST(makeRequest({ projectId: 'smart-campus-nav', action: 'APPROVE' }));
    expect(res.status).toBe(403);
    expect(prisma.project.update).not.toHaveBeenCalled();
  });

  it('returns 400 when projectId is missing', async () => {
    getCurrentUser.mockResolvedValue({ id: 'usr_admin_1', role: 'ADMIN' });

    const res = await POST(makeRequest({ action: 'APPROVE' }));
    expect(res.status).toBe(400);
  });
});
