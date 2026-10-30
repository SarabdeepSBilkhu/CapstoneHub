import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { mockDb } from '@/lib/mock-db';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Please log in' }, { status: 401 });
    }

    const { projectId, action, milestoneData, submissionData, reviewData } = await req.json();

    if (!projectId || !action) {
      return NextResponse.json({ error: 'Missing projectId or action' }, { status: 400 });
    }

    // 1. SUPERVISOR CREATES MILESTONE
    if (action === 'CREATE') {
      if (user.role !== 'SUPERVISOR' && user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized: Supervisors only' }, { status: 403 });
      }

      const { title, description, dueDate, weightage } = milestoneData;
      let newMilestone: any = null;

      try {
        newMilestone = await prisma.milestone.create({
          data: {
            projectId,
            title,
            description,
            dueDate: new Date(dueDate),
            weightage: Number(weightage),
            status: 'PENDING',
          },
        });
      } catch {
        await mockDb.init();
        const proj = mockDb.projects.find((p) => p.id === projectId);
        if (proj) {
          newMilestone = {
            id: 'ms_' + Date.now(),
            projectId,
            title,
            description,
            dueDate,
            weightage: Number(weightage),
            status: 'PENDING' as const,
          };
          proj.milestones.push(newMilestone);
        }
      }

      return NextResponse.json({ milestone: newMilestone, message: 'Milestone created successfully' });
    }

    // 2. STUDENT SUBMITS DELIVERABLE
    if (action === 'SUBMIT') {
      if (user.role !== 'STUDENT') {
        return NextResponse.json({ error: 'Unauthorized: Students only' }, { status: 403 });
      }

      const { milestoneId, deliverableUrl } = submissionData;
      let updatedMilestone: any = null;

      try {
        updatedMilestone = await prisma.milestone.update({
          where: { id: milestoneId },
          data: {
            deliverableUrl,
            status: 'SUBMITTED',
            submittedAt: new Date(),
          },
        });
      } catch {
        await mockDb.init();
        const proj = mockDb.projects.find((p) => p.id === projectId);
        const ms = proj?.milestones.find((m) => m.id === milestoneId);
        if (ms) {
          ms.deliverableUrl = deliverableUrl;
          ms.status = 'SUBMITTED';
          ms.submittedAt = new Date().toISOString();
          updatedMilestone = ms;
        }
      }

      return NextResponse.json({ milestone: updatedMilestone, message: 'Deliverable submitted for review' });
    }

    // 3. SUPERVISOR REVIEWS DELIVERABLE (APPROVE or REVISE)
    if (action === 'REVIEW') {
      if (user.role !== 'SUPERVISOR' && user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized: Supervisors only' }, { status: 403 });
      }

      const { milestoneId, status, feedback } = reviewData; // status: "APPROVED" or "REVISION_REQUESTED"
      let updatedMilestone: any = null;

      try {
        updatedMilestone = await prisma.milestone.update({
          where: { id: milestoneId },
          data: {
            status,
            feedback,
            reviewedAt: new Date(),
          },
        });
      } catch {
        await mockDb.init();
        const proj = mockDb.projects.find((p) => p.id === projectId);
        const ms = proj?.milestones.find((m) => m.id === milestoneId);
        if (ms) {
          ms.status = status;
          ms.feedback = feedback;
          ms.reviewedAt = new Date().toISOString();
          updatedMilestone = ms;
        }
      }

      return NextResponse.json({
        milestone: updatedMilestone,
        message: status === 'APPROVED' ? 'Milestone approved! Progress updated.' : 'Revision requested from team',
      });
    }

    return NextResponse.json({ error: 'Invalid action type' }, { status: 400 });
  } catch (error) {
    console.error('Milestone action error:', error);
    return NextResponse.json({ error: 'Failed to process milestone request' }, { status: 500 });
  }
}

