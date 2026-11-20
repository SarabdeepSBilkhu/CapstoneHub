/**
 * Integration tests: /api/projects/publish route
 * Tests ADMIN-only publication to the public showcase.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/projects/publish/route';
import { prisma } from '@/lib/prisma';

vi.mock('@/lib/auth', () => ({ getCurrentUser: vi.fn() }));
import { getCurrentUser } from '@/lib/auth';

const makeRequest = (body) => ({ json: async () => body });

describe('POST /api/projects/publish', () => {
  beforeEach(() => vi.clearAllMocks());

  it('allows ADMIN to publish project to public showcase', async () => {
    getCurrentUser.mockResolvedValue({ id: 'usr_admin_1', role: 'ADMIN' });
    prisma.project.update.mockResolvedValue({
      id: 'smart-campus-nav',
      isPublicShowcase: true,
      status: 'COMPLETED',
      showcaseSummary: 'Award-winning campus navigation.',
      demoUrl: 'https://smartcampus.demo',
      githubUrl: 'https://github.com/capstonehub/nav',
    });

    const res = await POST(makeRequest({
      projectId: 'smart-campus-nav',
      isPublicShowcase: true,
      showcaseSummary: 'Award-winning campus navigation.',
      demoUrl: 'https://smartcampus.demo',
      githubUrl: 'https://github.com/capstonehub/nav',
    }));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.project.isPublicShowcase).toBe(true);
    expect(body.project.status).toBe('COMPLETED');
    expect(prisma.project.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'smart-campus-nav' },
        data: expect.objectContaining({ isPublicShowcase: true, status: 'COMPLETED' }),
      })
    );
  });

  it('returns 403 for STUDENT role', async () => {
    getCurrentUser.mockResolvedValue({ id: 'usr_student_1', role: 'STUDENT' });

    const res = await POST(makeRequest({ projectId: 'smart-campus-nav' }));
    expect(res.status).toBe(403);
  });

  it('returns 400 when projectId is missing', async () => {
    getCurrentUser.mockResolvedValue({ id: 'usr_admin_1', role: 'ADMIN' });

    const res = await POST(makeRequest({ isPublicShowcase: true }));
    expect(res.status).toBe(400);
  });
});
