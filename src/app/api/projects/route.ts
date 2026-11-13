import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const status = searchParams.get('status');

    const where: any = {};
    if (category && category !== 'ALL') where.category = category;
    if (status && status !== 'ALL') where.status = status;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { problemStatement: { contains: search, mode: 'insensitive' } },
      ];
    }

    const projects = await prisma.project.findMany({
      where,
      include: {
        sponsor: true,
        supervisor: true,
        allocatedTeam: {
          include: {
            members: { include: { user: true } },
          },
        },
        applications: true,
        milestones: { orderBy: { dueDate: 'asc' } },
        supervisorLogs: { orderBy: { meetingDate: 'desc' } },
        evaluations: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Fetch projects error:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}
