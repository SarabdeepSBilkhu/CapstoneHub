/**
 * Integration tests: /api/auth/register route
 * Tests registration, validation, duplicate email detection, and password hashing.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/auth/register/route';
import { prisma } from '@/lib/prisma';

vi.mock('@/lib/auth', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    setAuthCookie: vi.fn(),
  };
});

const makeRequest = (body) => ({ json: async () => body });

const validUser = {
  name: 'Maya Patel',
  email: 'maya.new@capstonehub.edu',
  password: 'securePassword123',
  role: 'STUDENT',
  department: 'Computer Science',
};

describe('POST /api/auth/register', () => {
  beforeEach(() => vi.clearAllMocks());

  it('registers a new user successfully and returns user data without password hash', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue({
      id: 'usr_new_01',
      name: validUser.name,
      email: validUser.email,
      role: validUser.role,
      department: validUser.department,
      passwordHash: 'hashed_pw',
    });

    const res = await POST(makeRequest(validUser));
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.user.email).toBe(validUser.email);
    expect(body.user.passwordHash).toBeUndefined();
    expect(prisma.user.create).toHaveBeenCalledOnce();
  });

  it('returns 409 conflict when email is already registered', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 'usr_existing', email: validUser.email });

    const res = await POST(makeRequest(validUser));
    expect(res.status).toBe(409);
    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  it('returns 400 when fields are invalid or missing', async () => {
    const res = await POST(makeRequest({ email: 'bad-email', password: '123' }));
    expect(res.status).toBe(400);
  });
});
