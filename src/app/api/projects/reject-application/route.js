import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPERVISOR')) {
      return NextResponse.json({ error: 'Unauthorized: Admins and Supervisors only' }, { status: 403 });
    }

    const { applicationId } = await req.json();
    if (!applicationId) {
      return NextResponse.json({ error: 'Missing applicationId' }, { status: 400 });
    }

    const app = await prisma.projectApplication.update({
      where: { id: applicationId },
      data: { status: 'REJECTED', reviewedAt: new Date() },
    });

    return NextResponse.json({
      application: app,
      message: 'Application rejected.',
    });
  } catch (error) {
    console.error('Reject application error:', error);
    return NextResponse.json({ error: 'Failed to reject application' }, { status: 500 });
  }
}
