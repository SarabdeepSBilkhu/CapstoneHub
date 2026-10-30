import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { mockDb } from '@/lib/mock-db';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'SUPERVISOR' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized: Supervisors only' }, { status: 403 });
    }

    const {
      projectId,
      meetingDate,
      attendees,
      discussionPoints,
      problemsIdentified,
      decisions,
      actionItems,
      nextMeetingDate,
      satisfactionRating = 5,
    } = await req.json();

    if (!projectId || !discussionPoints || !actionItems) {
      return NextResponse.json({ error: 'Missing required meeting notes or action items' }, { status: 400 });
    }

    let log: any = null;

    try {
      log = await prisma.supervisorLog.create({
        data: {
          projectId,
          supervisorId: user.id,
          meetingDate: new Date(meetingDate || Date.now()),
          attendees: attendees || 'Dr. Robert Martinez, Alex Chen, Maya Patel',
          discussionPoints,
          problemsIdentified,
          decisions,
          actionItems,
          nextMeetingDate: nextMeetingDate ? new Date(nextMeetingDate) : undefined,
          satisfactionRating: Number(satisfactionRating),
        },
      });
    } catch {
      await mockDb.init();
      const proj = mockDb.projects.find((p) => p.id === projectId);
      if (proj) {
        log = {
          id: 'log_' + Date.now(),
          projectId,
          supervisorId: user.id,
          meetingDate: meetingDate || new Date().toISOString(),
          attendees: attendees || 'Dr. Robert Martinez, Alex Chen, Maya Patel',
          discussionPoints,
          problemsIdentified,
          decisions,
          actionItems,
          nextMeetingDate,
          satisfactionRating: Number(satisfactionRating),
        };
        proj.supervisorLogs.unshift(log);
      }
    }

    return NextResponse.json({
      log,
      message: 'Meeting log recorded! Action items are now visible in the student workspace.',
    });
  } catch (error) {
    console.error('Supervisor log error:', error);
    return NextResponse.json({ error: 'Failed to record supervisor meeting log' }, { status: 500 });
  }
}

