import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'EXAMINER' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized: Examiners and Admins only' }, { status: 403 });
    }

    const {
      projectId,
      technicalImplementationScore,
      problemUnderstandingScore,
      innovationScore,
      documentationScore,
      presentationScore,
      projectOutcomeScore,
      comments,
    } = await req.json();

    const tech = Math.min(25, Math.max(0, Number(technicalImplementationScore) || 0));
    const problem = Math.min(15, Math.max(0, Number(problemUnderstandingScore) || 0));
    const innov = Math.min(15, Math.max(0, Number(innovationScore) || 0));
    const doc = Math.min(15, Math.max(0, Number(documentationScore) || 0));
    const pres = Math.min(15, Math.max(0, Number(presentationScore) || 0));
    const outcome = Math.min(15, Math.max(0, Number(projectOutcomeScore) || 0));
    const totalScore = Number((tech + problem + innov + doc + pres + outcome).toFixed(1));

    const evaluation = await prisma.evaluation.upsert({
      where: {
        projectId_examinerId: {
          projectId,
          examinerId: user.id,
        },
      },
      update: {
        technicalImplementationScore: tech,
        problemUnderstandingScore: problem,
        innovationScore: innov,
        documentationScore: doc,
        presentationScore: pres,
        projectOutcomeScore: outcome,
        totalScore,
        comments,
        isSubmitted: true,
        submittedAt: new Date(),
      },
      create: {
        projectId,
        examinerId: user.id,
        technicalImplementationScore: tech,
        problemUnderstandingScore: problem,
        innovationScore: innov,
        documentationScore: doc,
        presentationScore: pres,
        projectOutcomeScore: outcome,
        totalScore,
        comments,
        isSubmitted: true,
        submittedAt: new Date(),
      },
    });

    return NextResponse.json({
      evaluation,
      message: `Evaluation submitted successfully by ${user.name}! Score: ${totalScore}/100`,
    });
  } catch (error) {
    console.error('Rubric submit error:', error);
    return NextResponse.json({ error: 'Failed to record rubric evaluation' }, { status: 500 });
  }
}

