/**
 * Integration tests: GET /api/evaluations route
 * Tests listing rubric evaluations and filtering by projectId.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/evaluations/route';
import { prisma } from '@/lib/prisma';

const makeGetRequest = (queryString = '') => ({
  url: `http://localhost/api/evaluations${queryString}`,
});

describe('GET /api/evaluations', () => {
  beforeEach(() => vi.clearAllMocks());

  it('fetches evaluations filtered by projectId', async () => {
    prisma.evaluation.findMany.mockResolvedValue([
      {
        id: 'eval_1',
        projectId: 'smart-campus-nav',
        totalScore: 95.5,
        examiner: { id: 'usr_ex_1', name: 'Prof. Jenkins', email: 'examiner@capstonehub.edu' },
      },
    ]);

    const res = await GET(makeGetRequest('?projectId=smart-campus-nav'));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.evaluations).toHaveLength(1);
    expect(body.evaluations[0].totalScore).toBe(95.5);
    expect(prisma.evaluation.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { projectId: 'smart-campus-nav' },
      })
    );
  });
});
