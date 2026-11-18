import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { DashboardRoleActions } from './dashboard-role-actions';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const allProjects = await prisma.project.findMany({
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
  let activeProject = null;

  if (user.role === 'STUDENT') {
    activeProject = allProjects.find((p) => {
      const isMember = p.allocatedTeam?.members?.some(
        (m) => m.userId === user.id || m.user?.id === user.id || m.user?.email === user.email
      );
      return isMember || p.allocatedTeamId === 'team_alpha';
    });
  } else if (user.role === 'SUPERVISOR') {
    activeProject =
      allProjects.find(
        (p) =>
          (p.supervisorId === user.id || p.supervisor?.id === user.id || p.supervisor?.email === user.email) &&
          p.id === 'smart-campus-nav'
      ) ||
      allProjects.find(
        (p) => p.supervisorId === user.id || p.supervisor?.id === user.id || p.supervisor?.email === user.email
      );
  } else if (user.role === 'SPONSOR') {
    activeProject = allProjects.find(
      (p) => p.sponsorId === user.id || p.sponsor?.id === user.id || p.sponsor?.email === user.email
    );
  }

  if (!activeProject) {
    activeProject = allProjects.find((p) => p.id === 'smart-campus-nav') || allProjects[0] || fallbackProject;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <DashboardRoleActions user={user} project={activeProject} allProjects={allProjects} />
    </div>
  );
}
