import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

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

    // Find an existing unallocated team for this user, or create a new team for this cohort application
    let team = await prisma.team.findFirst({
      where: {
        members: { some: { userId: user.id } },
        allocatedProject: null, // only reuse if not already allocated to another project
        ...(teamName ? { name: teamName } : {}),
      },
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

    const application = await prisma.projectApplication.create({
      data: {
        projectId,
        teamId: team.id,
        proposal,
        status: 'PENDING',
      },
    });

    return NextResponse.json({
      application,
      message: 'Application submitted successfully to supervisor/admin review committee',
    });
  } catch (error) {
    console.error('Project application error:', error);
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
  }
}

