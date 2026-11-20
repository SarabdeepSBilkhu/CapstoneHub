/**
 * Integration tests: GET /api/projects route
 * Tests listing projects, filtering by category, status, and text search.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/projects/route';
import { prisma } from '@/lib/prisma';

const makeGetRequest = (queryString = '') => ({
  url: `http://localhost/api/projects${queryString}`,
});

describe('GET /api/projects', () => {
  beforeEach(() => vi.clearAllMocks());

  it('fetches all projects successfully', async () => {
    prisma.project.findMany.mockResolvedValue([
      { id: 'proj_1', title: 'Smart Campus Nav', status: 'ALLOCATED' },
      { id: 'proj_2', title: 'AI Mental Health Bot', status: 'IN_PROGRESS' },
    ]);

    const res = await GET(makeGetRequest());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.projects).toHaveLength(2);
    expect(prisma.project.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {},
        orderBy: { createdAt: 'desc' },
      })
    );
  });

  it('filters by category and status', async () => {
    prisma.project.findMany.mockResolvedValue([]);

    await GET(makeGetRequest('?category=INDUSTRY_SPONSORED&status=APPROVED'));

    expect(prisma.project.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          category: 'INDUSTRY_SPONSORED',
          status: 'APPROVED',
        },
      })
    );
  });

  it('applies text search filter across title, description, and problemStatement', async () => {
    prisma.project.findMany.mockResolvedValue([]);

    await GET(makeGetRequest('?search=drone'));

    expect(prisma.project.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          OR: [
            { title: { contains: 'drone', mode: 'insensitive' } },
            { description: { contains: 'drone', mode: 'insensitive' } },
            { problemStatement: { contains: 'drone', mode: 'insensitive' } },
          ],
        },
      })
    );
  });
});
