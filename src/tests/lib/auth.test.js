/**
 * Unit tests: src/lib/auth.js
 * Tests pure functions: hashPassword, verifyPassword, signToken, verifyToken.
 * getCurrentUser is integration-tested in api/auth tests.
 */
import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword, signToken, verifyToken } from '@/lib/auth';

describe('hashPassword() / verifyPassword()', () => {
  it('hashes a password and verifies it correctly', async () => {
    const hash = await hashPassword('mySecretPassword');
    expect(hash).not.toBe('mySecretPassword');
    expect(hash.startsWith('$2b$')).toBe(true);

    const match = await verifyPassword('mySecretPassword', hash);
    expect(match).toBe(true);
  });

  it('returns false for a wrong password', async () => {
    const hash = await hashPassword('correctPassword');
    const match = await verifyPassword('wrongPassword', hash);
    expect(match).toBe(false);
  });
});

describe('signToken() / verifyToken()', () => {
  it('signs a token and verifies the payload', () => {
    const payload = { userId: 'usr_001', role: 'ADMIN' };
    const token = signToken(payload);

    expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(3); // JWT has 3 parts

    const decoded = verifyToken(token);
    expect(decoded.userId).toBe('usr_001');
    expect(decoded.role).toBe('ADMIN');
  });

  it('returns null for a tampered token', () => {
    const token = signToken({ userId: 'usr_002' });
    const tampered = token.slice(0, -5) + 'XXXXX';
    expect(verifyToken(tampered)).toBeNull();
  });

  it('returns null for a completely invalid string', () => {
    expect(verifyToken('not.a.token')).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(verifyToken('')).toBeNull();
  });
});
