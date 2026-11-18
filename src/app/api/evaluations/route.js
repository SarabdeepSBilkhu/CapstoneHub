import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { POST as submitPost } from './submit/route';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');

    const where = {};
    if (projectId) where.projectId = projectId;

    const evaluations = await prisma.evaluation.findMany({
      where,
      include: {
        examiner: {
          select: { id: true, name: true, email: true, department: true },
        },
        project: {
          select: { id: true, title: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ evaluations });
  } catch (error) {
    console.error('Fetch evaluations error:', error);
    return NextResponse.json({ error: 'Failed to fetch evaluations' }, { status: 500 });
  }
}

export async function POST(req) {
  return submitPost(req);
}
