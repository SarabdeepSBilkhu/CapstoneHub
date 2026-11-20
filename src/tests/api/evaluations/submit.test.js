/**
 * Integration tests: /api/evaluations/submit route
 * Tests examiner score persistence, clamping, and RBAC.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/evaluations/submit/route';
import { prisma } from '@/lib/prisma';

vi.mock('@/lib/auth', () => ({ getCurrentUser: vi.fn() }));
import { getCurrentUser } from '@/lib/auth';

const makeRequest = (body) => ({ json: async () => body });

const validPayload = {
  projectId: 'smart-campus-nav',
  examinerEmail: 'examiner@capstonehub.edu',
  examinerId: 'usr_examiner_1',
  technicalImplementationScore: 24,
  problemUnderstandingScore: 14,
  innovationScore: 14,
  documentationScore: 14,
  presentationScore: 14,
  projectOutcomeScore: 14,
  comments: 'Strong technical delivery.',
};

describe('POST /api/evaluations/submit', () => {
  beforeEach(() => vi.clearAllMocks());

  it('saves evaluation for EXAMINER and returns total score', async () => {
    getCurrentUser.mockResolvedValue({ id: 'usr_examiner_1', role: 'EXAMINER', name: 'Prof. Jenkins' });
    prisma.evaluation.upsert.mockResolvedValue({
      id: 'eval_new',
      projectId: 'smart-campus-nav',
      examinerId: 'usr_examiner_1',
      totalScore: 94,
      isSubmitted: true,
      examiner: { id: 'usr_examiner_1', name: 'Prof. Jenkins', email: 'examiner@capstonehub.edu' },
    });

    const res = await POST(makeRequest(validPayload));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.evaluation.totalScore).toBe(94);
    expect(body.evaluation.isSubmitted).toBe(true);
    expect(prisma.evaluation.upsert).toHaveBeenCalledOnce();
  });

  it('clamps scores that exceed the maximum', async () => {
    getCurrentUser.mockResolvedValue({ id: 'usr_examiner_1', role: 'EXAMINER', name: 'Prof. Jenkins' });
    prisma.evaluation.upsert.mockResolvedValue({
      id: 'eval_clamped',
      projectId: 'smart-campus-nav',
      examinerId: 'usr_examiner_1',
      technicalImplementationScore: 25, // clamped from 999
      totalScore: 100,
      isSubmitted: true,
      examiner: { id: 'usr_examiner_1', name: 'Prof. Jenkins', email: 'examiner@capstonehub.edu' },
    });

    const res = await POST(makeRequest({
      ...validPayload,
      technicalImplementationScore: 999, // should be clamped to 25
    }));
    const body = await res.json();

    expect(res.status).toBe(200);
    // Verify upsert was called with clamped value
    const upsertArg = prisma.evaluation.upsert.mock.calls[0][0];
    expect(upsertArg.update.technicalImplementationScore).toBe(25);
  });

  it('returns 403 for STUDENT role', async () => {
    getCurrentUser.mockResolvedValue({ id: 'usr_student_1', role: 'STUDENT' });

    const res = await POST(makeRequest(validPayload));
    expect(res.status).toBe(403);
    expect(prisma.evaluation.upsert).not.toHaveBeenCalled();
  });

  it('returns 403 for unauthenticated request', async () => {
    getCurrentUser.mockResolvedValue(null);

    const res = await POST(makeRequest(validPayload));
    expect(res.status).toBe(403);
  });

  it('returns 400 when projectId is missing', async () => {
    getCurrentUser.mockResolvedValue({ id: 'usr_examiner_1', role: 'EXAMINER' });

    const { projectId: _, ...noProject } = validPayload;
    const res = await POST(makeRequest(noProject));
    expect(res.status).toBe(400);
  });

  it('allows ADMIN to override any examiner score', async () => {
    getCurrentUser.mockResolvedValue({ id: 'usr_admin_1', role: 'ADMIN', name: 'Admin' });
    prisma.evaluation.upsert.mockResolvedValue({
      id: 'eval_admin_override',
      projectId: 'smart-campus-nav',
      examinerId: 'usr_examiner_2',
      totalScore: 90,
      isSubmitted: true,
      examiner: { id: 'usr_examiner_2', name: 'Dr. Sharma', email: 'examiner2@capstonehub.edu' },
    });

    const res = await POST(makeRequest({
      ...validPayload,
      examinerId: 'usr_examiner_2', // admin overriding examiner 2's score
    }));
    const body = await res.json();

    expect(res.status).toBe(200);
    // Admin should target examiner_2 not themselves
    const upsertArg = prisma.evaluation.upsert.mock.calls[0][0];
    expect(upsertArg.where.projectId_examinerId.examinerId).toBe('usr_examiner_2');
  });
});
