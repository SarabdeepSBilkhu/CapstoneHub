/**
 * Integration tests: /api/milestones/action route
 * Tests SUBMIT (student) and REVIEW (supervisor) actions.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/milestones/action/route';
import { prisma } from '@/lib/prisma';

vi.mock('@/lib/auth', () => ({ getCurrentUser: vi.fn() }));
import { getCurrentUser } from '@/lib/auth';

const makeRequest = (body) => ({ json: async () => body });

const milestone = {
  id: 'ms_001',
  projectId: 'smart-campus-nav',
  title: 'BLE Integration',
  status: 'PENDING',
};

describe('POST /api/milestones/action — SUBMIT', () => {
  beforeEach(() => vi.clearAllMocks());

  it('allows a STUDENT to submit a deliverable URL', async () => {
    getCurrentUser.mockResolvedValue({ id: 'usr_student_1', role: 'STUDENT' });
    prisma.milestone.findUnique.mockResolvedValue(milestone);
    prisma.milestone.update.mockResolvedValue({
      ...milestone,
      status: 'SUBMITTED',
      deliverableUrl: 'https://github.com/capstonehub/smart-campus-nav',
    });

    const res = await POST(makeRequest({
      projectId: 'smart-campus-nav',
      action: 'SUBMIT',
      submissionData: {
        milestoneId: 'ms_001',
        deliverableUrl: 'https://github.com/capstonehub/smart-campus-nav',
      },
    }));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.milestone.status).toBe('SUBMITTED');
    expect(body.milestone.deliverableUrl).toContain('github.com');
  });

  it('rejects SUBMIT with an invalid URL', async () => {
    getCurrentUser.mockResolvedValue({ id: 'usr_student_1', role: 'STUDENT' });

    const res = await POST(makeRequest({
      projectId: 'smart-campus-nav',
      action: 'SUBMIT',
      submissionData: { milestoneId: 'ms_001', deliverableUrl: 'not-a-url' },
    }));

    expect(res.status).toBe(400);
  });
});

describe('POST /api/milestones/action — REVIEW', () => {
  it('allows a SUPERVISOR to approve a milestone', async () => {
    getCurrentUser.mockResolvedValue({ id: 'usr_supervisor_1', role: 'SUPERVISOR' });
    prisma.milestone.findUnique.mockResolvedValue({ ...milestone, status: 'SUBMITTED' });
    prisma.milestone.update.mockResolvedValue({
      ...milestone,
      status: 'APPROVED',
      feedback: 'Well done — solid implementation.',
    });

    const res = await POST(makeRequest({
      projectId: 'smart-campus-nav',
      action: 'REVIEW',
      reviewData: {
        milestoneId: 'ms_001',
        status: 'APPROVED',
        feedback: 'Well done — solid implementation.',
      },
    }));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.milestone.status).toBe('APPROVED');
    expect(body.milestone.feedback).toContain('solid');
  });

  it('allows a SUPERVISOR to request revision', async () => {
    getCurrentUser.mockResolvedValue({ id: 'usr_supervisor_1', role: 'SUPERVISOR' });
    prisma.milestone.findUnique.mockResolvedValue({ ...milestone, status: 'SUBMITTED' });
    prisma.milestone.update.mockResolvedValue({
      ...milestone,
      status: 'REVISION_REQUESTED',
      feedback: 'Please fix the BLE initialization race condition.',
    });

    const res = await POST(makeRequest({
      projectId: 'smart-campus-nav',
      action: 'REVIEW',
      reviewData: {
        milestoneId: 'ms_001',
        status: 'REVISION_REQUESTED',
        feedback: 'Please fix the BLE initialization race condition.',
      },
    }));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.milestone.status).toBe('REVISION_REQUESTED');
  });

  it('returns 403 for STUDENT trying to REVIEW', async () => {
    getCurrentUser.mockResolvedValue({ id: 'usr_student_1', role: 'STUDENT' });

    const res = await POST(makeRequest({
      projectId: 'smart-campus-nav',
      action: 'REVIEW',
      reviewData: { milestoneId: 'ms_001', status: 'APPROVED', feedback: 'Self approved' },
    }));

    expect(res.status).toBe(403);
  });
});
