import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { mockDb } from '@/lib/mock-db';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Administrators only' }, { status: 403 });
    }

    const { projectId, isPublicShowcase, showcaseSummary, demoUrl, githubUrl } = await req.json();

    if (!projectId) {
      return NextResponse.json({ error: 'Missing projectId' }, { status: 400 });
    }

    let project: any = null;

    try {
      project = await prisma.project.update({
        where: { id: projectId },
        data: {
          isPublicShowcase: isPublicShowcase !== undefined ? Boolean(isPublicShowcase) : true,
          status: 'COMPLETED',
          showcaseSummary,
          demoUrl,
          githubUrl,
        },
      });
    } catch {
      await mockDb.init();
      const proj = mockDb.projects.find((p) => p.id === projectId);
      if (proj) {
        proj.isPublicShowcase = isPublicShowcase !== undefined ? Boolean(isPublicShowcase) : true;
        proj.status = 'COMPLETED';
        if (showcaseSummary) proj.showcaseSummary = showcaseSummary;
        if (demoUrl) proj.demoUrl = demoUrl;
        if (githubUrl) proj.githubUrl = githubUrl;
        project = proj;
      }
    }

    return NextResponse.json({
      project,
      message: 'Project published to Public Showcase for university accreditation and portfolio review!',
    });
  } catch (error) {
    console.error('Showcase publish error:', error);
    return NextResponse.json({ error: 'Failed to publish to public showcase' }, { status: 500 });
  }
}

