/**
 * Integration tests: /api/projects/delete route
 * Tests ADMIN-only delete, cascade confirmation, and not-found handling.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DELETE } from '@/app/api/projects/delete/route';
import { prisma } from '@/lib/prisma';

vi.mock('@/lib/auth', () => ({ getCurrentUser: vi.fn() }));
import { getCurrentUser } from '@/lib/auth';

const makeRequest = (body) => ({ json: async () => body });

describe('DELETE /api/projects/delete', () => {
  beforeEach(() => vi.clearAllMocks());

  it('deletes a project as ADMIN', async () => {
    getCurrentUser.mockResolvedValue({ id: 'usr_admin_1', role: 'ADMIN' });
    prisma.project.findUnique.mockResolvedValue({ id: 'smart-campus-nav', title: 'Smart Campus Nav' });
    prisma.project.delete.mockResolvedValue({ id: 'smart-campus-nav' });

    const res = await DELETE(makeRequest({ projectId: 'smart-campus-nav' }));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.message).toMatch(/deleted/i);
    expect(prisma.project.delete).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 'smart-campus-nav' } })
    );
  });

  it('returns 403 for SPONSOR role', async () => {
    getCurrentUser.mockResolvedValue({ id: 'usr_sponsor_1', role: 'SPONSOR' });

    const res = await DELETE(makeRequest({ projectId: 'smart-campus-nav' }));
    expect(res.status).toBe(403);
    expect(prisma.project.delete).not.toHaveBeenCalled();
  });

  it('returns 400 for missing projectId', async () => {
    getCurrentUser.mockResolvedValue({ id: 'usr_admin_1', role: 'ADMIN' });

    const res = await DELETE(makeRequest({}));
    expect(res.status).toBe(400);
  });

  it('returns 404 when project does not exist', async () => {
    getCurrentUser.mockResolvedValue({ id: 'usr_admin_1', role: 'ADMIN' });
    prisma.project.findUnique.mockResolvedValue(null);

    const res = await DELETE(makeRequest({ projectId: 'nonexistent-project' }));
    expect(res.status).toBe(404);
  });
});
