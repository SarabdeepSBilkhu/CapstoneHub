/**
 * Integration tests: /api/auth/login route
 * Mocks Prisma and cookie headers. Verifies correct responses for
 * valid login, wrong password, unknown email, and missing fields.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/auth/login/route';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

// Mock setAuthCookie so it doesn't touch next/headers internals
vi.mock('@/lib/auth', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    setAuthCookie: vi.fn(),
    getCurrentUser: vi.fn(),
  };
});

const makeRequest = (body) => ({
  json: async () => body,
});

describe('POST /api/auth/login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 200 and user data for valid credentials', async () => {
    const passwordHash = await hashPassword('password123');
    prisma.user.findUnique.mockResolvedValue({
      id: 'usr_student_1',
      email: 'student@capstonehub.edu',
      name: 'Alex Chen',
      passwordHash,
      role: 'STUDENT',
      department: 'Computer Science',
    });

    const req = makeRequest({ email: 'student@capstonehub.edu', password: 'password123' });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.user.email).toBe('student@capstonehub.edu');
    expect(body.user.role).toBe('STUDENT');
    expect(body.user.passwordHash).toBeUndefined(); // never expose hash
  });

  it('returns 401 for wrong password', async () => {
    const passwordHash = await hashPassword('correctPassword');
    prisma.user.findUnique.mockResolvedValue({
      id: 'usr_1',
      email: 'x@y.com',
      name: 'Test',
      passwordHash,
      role: 'STUDENT',
    });

    const req = makeRequest({ email: 'x@y.com', password: 'wrongPassword' });
    const res = await POST(req);

    expect(res.status).toBe(401);
  });

  it('returns 401 for unknown email', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    const req = makeRequest({ email: 'nobody@capstonehub.edu', password: 'whatever' });
    const res = await POST(req);

    expect(res.status).toBe(401);
  });

  it('returns 400 for missing email field', async () => {
    const req = makeRequest({ password: 'password123' });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('returns 400 for invalid email format', async () => {
    const req = makeRequest({ email: 'not-an-email', password: 'password123' });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
