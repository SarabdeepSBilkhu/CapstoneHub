import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function DELETE(req) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Administrators only' }, { status: 403 });
    }

    let projectId = null;

    if (req.url) {
      try {
        const url = new URL(req.url, 'http://localhost');
        projectId = url.searchParams.get('id') || url.searchParams.get('projectId');
      } catch {
        // Fall back to JSON body if URL parsing fails
      }
    }

    if (!projectId) {
      try {
        const body = await req.json();
        projectId = body?.projectId || body?.id;
      } catch {
        // No body provided
      }
    }

    if (!projectId) {
      return NextResponse.json({ error: 'Missing project id' }, { status: 400 });
    }

    const existing = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    await prisma.project.delete({
      where: { id: projectId },
    });

    return NextResponse.json({ message: 'Project deleted successfully', projectId });
  } catch (error) {
    console.error('Delete project error:', error);
    return NextResponse.json({ error: 'Failed to delete project: ' + error.message }, { status: 500 });
  }
}
