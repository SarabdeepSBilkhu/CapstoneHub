/**
 * Integration tests: /api/auth/session route
 * Tests GET current session and POST logout.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from '@/app/api/auth/session/route';

vi.mock('@/lib/auth', () => ({
  getCurrentUser: vi.fn(),
  removeAuthCookie: vi.fn(),
}));
import { getCurrentUser, removeAuthCookie } from '@/lib/auth';

describe('GET /api/auth/session', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns current user session when authenticated', async () => {
    getCurrentUser.mockResolvedValue({
      id: 'usr_alex',
      name: 'Alex Chen',
      email: 'student@capstonehub.edu',
      role: 'STUDENT',
    });

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.user.name).toBe('Alex Chen');
    expect(body.user.role).toBe('STUDENT');
  });

  it('returns 401 when no session exists', async () => {
    getCurrentUser.mockResolvedValue(null);

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(401);
    expect(body.user).toBeNull();
  });
});

describe('POST /api/auth/session (Logout)', () => {
  it('clears the auth cookie and returns success message', async () => {
    const res = await POST();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.message).toMatch(/logged out/i);
    expect(removeAuthCookie).toHaveBeenCalledOnce();
  });
});
