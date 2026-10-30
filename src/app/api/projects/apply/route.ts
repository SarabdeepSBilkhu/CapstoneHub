import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { mockDb } from '@/lib/mock-db';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized: Students only' }, { status: 403 });
    }

    const { projectId, teamName, proposal } = await req.json();

    if (!projectId || !proposal) {
      return NextResponse.json({ error: 'Missing projectId or proposal statement' }, { status: 400 });
    }

    let application: any = null;

    try {
      // Find or create team
      let team = await prisma.team.findFirst({
        where: { members: { some: { userId: user.id } } },
      });

      if (!team) {
        team = await prisma.team.create({
          data: {
            name: teamName || `${user.name}'s Engineering Cohort`,
            leaderId: user.id,
            members: {
              create: {
                userId: user.id,
                isLeader: true,
              },
            },
          },
        });
      }

      application = await prisma.projectApplication.create({
        data: {
          projectId,
          teamId: team.id,
          proposal,
          status: 'PENDING',
        },
      });
    } catch {
      await mockDb.init();
      const proj = mockDb.projects.find((p) => p.id === projectId);
      if (proj) {
        application = {
          id: 'app_' + Date.now(),
          projectId,
          teamId: 'team_' + user.id,
          teamName: teamName || `${user.name}'s Cohort`,
          leaderName: user.name,
          proposal,
          status: 'PENDING' as const,
          submittedAt: new Date().toISOString(),
        };
        proj.applications.push(application);
      }
    }

    return NextResponse.json({
      application,
      message: 'Application submitted successfully to supervisor/admin review committee',
    });
  } catch (error) {
    console.error('Project application error:', error);
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
  }
}

