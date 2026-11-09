import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { mockDb } from '@/lib/mock-db';

export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Administrators only' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('id');

    if (!projectId) {
      return NextResponse.json({ error: 'Missing project id' }, { status: 400 });
    }

    // 1. Delete from PostgreSQL if database record exists
    try {
      await prisma.project.delete({
        where: { id: projectId },
      });
    } catch (dbErr: any) {
      console.warn('Prisma delete notice:', dbErr.message);
    }

    // 2. Always delete from mockDb and disk persistence to stay permanently synchronized
    await mockDb.init();
    mockDb.deleteProject(projectId);

    return NextResponse.json({ message: 'Project deleted successfully', projectId });
  } catch (error) {
    console.error('Delete project error:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}

