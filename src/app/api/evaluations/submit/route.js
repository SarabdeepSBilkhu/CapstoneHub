import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'EXAMINER' && user.role !== 'ADMIN')) {
      return NextResponse.json(
        { error: 'Unauthorized: Examiners and Admins only' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      projectId,
      examinerEmail,
      examinerId,
      technicalImplementationScore,
      problemUnderstandingScore,
      innovationScore,
      documentationScore,
      presentationScore,
      projectOutcomeScore,
      comments = '',
    } = body;

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    // Resolve target examiner
    let targetExaminerId = user.id;

    if (user.role === 'ADMIN') {
      if (examinerId) {
        targetExaminerId = examinerId;
      } else if (examinerEmail) {
        const examinerUser = await prisma.user.findUnique({
          where: { email: examinerEmail },
        });
        if (examinerUser) {
          targetExaminerId = examinerUser.id;
        }
      }
    }

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
          examinerId: targetExaminerId,
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
        examinerId: targetExaminerId,
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
      include: {
        examiner: {
          select: { id: true, name: true, email: true, department: true },
        },
        project: {
          select: { id: true, title: true },
        },
      },
    });

    return NextResponse.json({
      evaluation,
      message: `Evaluation score of ${totalScore}/100 successfully saved for ${evaluation.examiner?.name || user.name}!`,
    });
  } catch (error) {
    console.error('Evaluation submit error:', error);
    return NextResponse.json(
      { error: 'Failed to record rubric evaluation: ' + error.message },
      { status: 500 }
    );
  }
}
