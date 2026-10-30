import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { rubricEvaluationSchema } from '@/lib/validations';
import { mockDb } from '@/lib/mock-db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');

    let evaluations: any[] = [];
    try {
      const where: any = {};
      if (projectId) where.projectId = projectId;

      evaluations = await prisma.evaluation.findMany({
        where,
        include: {
          examiner: {
            select: { id: true, name: true, department: true },
          },
          project: {
            select: { id: true, title: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch {
      // Fallback to mock store
    }

    if (evaluations.length === 0) {
      await mockDb.init();
      evaluations = mockDb.evaluations;
    }

    return NextResponse.json({ evaluations });
  } catch (error) {
    console.error('Fetch evaluations error:', error);
    return NextResponse.json({ error: 'Failed to fetch evaluations' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Please log in' }, { status: 401 });
    }

    const body = await req.json();

    const {
      projectId,
      milestonePhase,
      problemDefinitionScore,
      methodologyScore,
      implementationScore,
      originalityScore,
      presentationScore,
      qualitativeRemarks,
    } = body;

    const totalScore =
      Number(problemDefinitionScore) +
      Number(methodologyScore) +
      Number(implementationScore) +
      Number(originalityScore) +
      Number(presentationScore);

    let evaluation: any = null;

    try {
      evaluation = await prisma.evaluation.upsert({
        where: {
          projectId_examinerId_milestonePhase: {
            projectId,
            examinerId: user.id,
            milestonePhase,
          },
        },
        update: {
          problemDefinitionScore,
          methodologyScore,
          implementationScore,
          originalityScore,
          presentationScore,
          totalScore,
          qualitativeRemarks,
        },
        create: {
          projectId,
          examinerId: user.id,
          milestonePhase,
          problemDefinitionScore,
          methodologyScore,
          implementationScore,
          originalityScore,
          presentationScore,
          totalScore,
          qualitativeRemarks,
        },
      });
    } catch {
      // Fallback save in mockDb
      await mockDb.init();
      evaluation = {
        id: 'eval_' + Date.now(),
        projectId,
        examinerId: user.id,
        milestonePhase,
        problemDefinitionScore,
        methodologyScore,
        implementationScore,
        originalityScore,
        presentationScore,
        totalScore,
        qualitativeRemarks,
      };
      mockDb.evaluations.push(evaluation);
    }

    return NextResponse.json({ evaluation }, { status: 201 });
  } catch (error) {
    console.error('Evaluation submit error:', error);
    return NextResponse.json({ error: 'Failed to submit evaluation' }, { status: 500 });
  }
}
