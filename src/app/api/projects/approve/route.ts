import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Administrators only' }, { status: 403 });
    }

    const { projectId, action } = await req.json(); // action: "APPROVE" or "REJECT"

    if (!projectId || !action) {
      return NextResponse.json({ error: 'Missing projectId or action' }, { status: 400 });
    }

    const newStatus = action === 'APPROVE' ? 'APPROVED' : 'ARCHIVED';

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: { status: newStatus },
    });

    return NextResponse.json({
      project: updatedProject,
      message: `Project ${action === 'APPROVE' ? 'approved and published to marketplace' : 'rejected'} successfully`,
    });
  } catch (error) {
    console.error('Project approval error:', error);
    return NextResponse.json({ error: 'Failed to update project status' }, { status: 500 });
  }
}

