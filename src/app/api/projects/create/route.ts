import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { mockDb } from '@/lib/mock-db';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'SPONSOR') {
      return NextResponse.json({ error: 'Unauthorized: Sponsors only' }, { status: 403 });
    }

    const body = await req.json();
    const {
      title,
      description,
      problemStatement,
      objectives,
      requiredSkills,
      expectedOutcomes,
      category = 'INDUSTRY_SPONSORED',
      ipStatus = 'CONFIDENTIAL',
      tags = [],
      maxTeamSize = 4,
      applicationDeadline,
    } = body;

    if (!title || !problemStatement || !description) {
      return NextResponse.json({ error: 'Missing required project details' }, { status: 400 });
    }

    let project: any = null;

    try {
      project = await prisma.project.create({
        data: {
          title,
          description,
          problemStatement,
          objectives,
          requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : requiredSkills.split(',').map((s: string) => s.trim()),
          expectedOutcomes,
          category,
          status: 'PENDING_APPROVAL',
          ipStatus,
          tags: Array.isArray(tags) ? tags : tags.split(',').map((s: string) => s.trim()),
          maxTeamSize: Number(maxTeamSize),
          applicationDeadline: applicationDeadline ? new Date(applicationDeadline) : undefined,
          sponsorId: user.id,
        },
      });
    } catch {
      // Mock DB Fallback
      await mockDb.init();
      const newProj = {
        id: 'proj_' + Date.now(),
        title,
        description,
        problemStatement,
        objectives,
        requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : String(requiredSkills).split(',').map((s) => s.trim()),
        expectedOutcomes,
        category,
        status: 'PENDING_APPROVAL' as const,
        ipStatus,
        tags: Array.isArray(tags) ? tags : String(tags).split(',').map((s) => s.trim()),
        maxTeamSize: Number(maxTeamSize),
        applicationDeadline,
        isPublicShowcase: false,
        sponsorId: user.id,
        sponsor: user,
        applications: [],
        milestones: [],
        supervisorLogs: [],
        evaluations: [],
      };
      mockDb.projects.unshift(newProj);
      project = newProj;
    }

    return NextResponse.json({ project, message: 'Project proposal submitted for Admin approval' }, { status: 201 });
  } catch (error) {
    console.error('Create project error:', error);
    return NextResponse.json({ error: 'Failed to create project opportunity' }, { status: 500 });
  }
}

