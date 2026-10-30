import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
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
      const proj = mockDb.projects.find((p) => p.id === (projectId || 'smart-campus-nav')) || mockDb.projects[0];
      evaluations = proj ? proj.evaluations : [];
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
    if (!user || (user.role !== 'EXAMINER' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized: Examiners and Admins only' }, { status: 403 });
    }

    const body = await req.json();

    const {
      projectId = 'smart-campus-nav',
      technicalImplementationScore = 24,
      problemUnderstandingScore = 14.5,
      innovationScore = 14,
      documentationScore = 14.5,
      presentationScore = 14,
      projectOutcomeScore = 14.5,
      comments = '',
    } = body;

    const tech = Math.min(25, Math.max(0, Number(technicalImplementationScore) || 0));
    const problem = Math.min(15, Math.max(0, Number(problemUnderstandingScore) || 0));
    const innov = Math.min(15, Math.max(0, Number(innovationScore) || 0));
    const doc = Math.min(15, Math.max(0, Number(documentationScore) || 0));
    const pres = Math.min(15, Math.max(0, Number(presentationScore) || 0));
    const outcome = Math.min(15, Math.max(0, Number(projectOutcomeScore) || 0));
    const totalScore = Number((tech + problem + innov + doc + pres + outcome).toFixed(1));

    let evaluation: any = null;

    try {
      evaluation = await prisma.evaluation.upsert({
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
    } catch {
      // Fallback save in mockDb
      await mockDb.init();
      const proj = mockDb.projects.find((p) => p.id === projectId) || mockDb.projects[0];
      if (proj) {
        let existing = proj.evaluations.find((e: any) => e.examinerId === user.id);
        if (!existing) {
          existing = {
            id: 'eval_' + Date.now(),
            projectId,
            examinerId: user.id,
            examinerName: user.name,
            examinerDepartment: user.department || 'Academic Committee',
            technicalImplementationScore: tech,
            problemUnderstandingScore: problem,
            innovationScore: innov,
            documentationScore: doc,
            presentationScore: pres,
            projectOutcomeScore: outcome,
            totalScore,
            comments: comments || '',
            isSubmitted: true,
            submittedAt: new Date().toISOString(),
          };
          proj.evaluations.push(existing);
        } else {
          existing.technicalImplementationScore = tech;
          existing.problemUnderstandingScore = problem;
          existing.innovationScore = innov;
          existing.documentationScore = doc;
          existing.presentationScore = pres;
          existing.projectOutcomeScore = outcome;
          existing.totalScore = totalScore;
          existing.comments = comments;
          existing.isSubmitted = true;
          existing.submittedAt = new Date().toISOString();
        }
        evaluation = existing;
      }
    }

    return NextResponse.json({ evaluation }, { status: 201 });
  } catch (error) {
    console.error('Evaluation submit error:', error);
    return NextResponse.json({ error: 'Failed to submit evaluation' }, { status: 500 });
  }
}
