import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { mockDb } from '@/lib/mock-db';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPERVISOR')) {
      return NextResponse.json({ error: 'Unauthorized: Supervisors and Admins only' }, { status: 403 });
    }

    const { projectId, selectedApplicationId } = await req.json();

    if (!projectId || !selectedApplicationId) {
      return NextResponse.json({ error: 'Missing projectId or selectedApplicationId' }, { status: 400 });
    }

    let resultProject: any = null;

    try {
      const selectedApp = await prisma.projectApplication.findUnique({
        where: { id: selectedApplicationId },
      });

      if (!selectedApp) {
        return NextResponse.json({ error: 'Application not found' }, { status: 404 });
      }

      // Accept selected team, reject all other applications for this project
      await prisma.projectApplication.updateMany({
        where: { projectId, id: { not: selectedApplicationId } },
        data: { status: 'REJECTED' },
      });

      await prisma.projectApplication.update({
        where: { id: selectedApplicationId },
        data: { status: 'ACCEPTED' },
      });

      resultProject = await prisma.project.update({
        where: { id: projectId },
        data: {
          allocatedTeamId: selectedApp.teamId,
          status: 'ALLOCATED',
        },
      });
    } catch {
      await mockDb.init();
      const proj = mockDb.projects.find((p) => p.id === projectId);
      if (proj) {
        proj.applications.forEach((app) => {
          if (app.id === selectedApplicationId) {
            app.status = 'ACCEPTED';
            proj.allocatedTeamId = app.teamId;
            proj.allocatedTeam = {
              id: app.teamId,
              name: app.teamName,
              members: [{ id: 'm1', isLeader: true, user: { name: app.leaderName, email: 'lead@demo.edu' } }],
            };
          } else {
            app.status = 'REJECTED';
          }
        });
        proj.status = 'ALLOCATED';
        resultProject = proj;
      }
    }

    return NextResponse.json({
      project: resultProject,
      message: 'Team allocated successfully! Project workspace is now active.',
    });
  } catch (error) {
    console.error('Allocation error:', error);
    return NextResponse.json({ error: 'Failed to allocate team' }, { status: 500 });
  }
}

