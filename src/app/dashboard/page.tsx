import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { mockDb } from '@/lib/mock-db';
import { DashboardRoleActions } from './dashboard-role-actions';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  let allProjects: any[] = [];
  let isDbConnected = false;

  try {
    allProjects = await prisma.project.findMany({
      include: {
        sponsor: true,
        supervisor: true,
        allocatedTeam: {
          include: {
            members: { include: { user: true } },
          },
        },
        applications: true,
        milestones: { orderBy: { dueDate: 'asc' } },
        supervisorLogs: { orderBy: { meetingDate: 'desc' } },
        evaluations: true,
      },
    });
    isDbConnected = true;
  } catch {
    isDbConnected = false;
  }

  if (!isDbConnected) {
    await mockDb.init();
    allProjects = mockDb.projects;
  } else if (allProjects.length === 0) {
    // DB is connected but has zero projects. Check if it was never initialized:
    const userCount = await prisma.user.count().catch(() => 0);
    if (userCount === 0) {
      await mockDb.init();
      allProjects = mockDb.projects;
    }
  }

  const fallbackProject = {
    id: 'none',
    title: 'No Active Projects Available',
    description: 'No capstone projects are currently assigned or active.',
    problemStatement: 'No active problem statement.',
    category: 'INDUSTRY_SPONSORED',
    status: 'ARCHIVED',
    ipStatus: 'OPEN_SOURCE',
    tags: [],
    milestones: [],
    supervisorLogs: [],
    evaluations: [],
    applications: [],
  };

  // Find the project relevant to this user based on role:
  // 1. If student: allocated project where user is member, or allocatedTeam.id
  // 2. If supervisor: project supervised by this user
  // 3. If sponsor: project sponsored by this user
  // 4. Default: first project or smart-campus-nav
  let activeProject = allProjects.find((p) => {
    if (user.role === 'STUDENT') {
      const isMember = p.allocatedTeam?.members?.some((m: any) => m.userId === user.id || m.user?.id === user.id || m.user?.email === user.email);
      return isMember || p.allocatedTeamId === 'team_alpha';
    }
    if (user.role === 'SUPERVISOR') {
      return p.supervisorId === user.id || p.supervisor?.id === user.id || p.supervisor?.email === user.email;
    }
    if (user.role === 'SPONSOR') {
      return p.sponsorId === user.id || p.sponsor?.id === user.id || p.sponsor?.email === user.email;
    }
    return false;
  });

  if (!activeProject) {
    activeProject = allProjects.find((p) => p.id === 'smart-campus-nav') || allProjects[0] || fallbackProject;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <DashboardRoleActions user={user} project={activeProject} allProjects={allProjects} />
    </div>
  );
}
