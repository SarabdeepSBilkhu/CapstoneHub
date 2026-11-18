import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { ProjectWorkspaceInteractive } from './workspace-interactive';

export default async function ProjectWorkspacePage({ params }) {
  const { id } = await params;
  const user = await getCurrentUser();

  const project = await prisma.project.findUnique({
    where: { id },
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
      evaluations: {
        include: { examiner: true },
      },
    },
  });

  if (!project) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Link href="/dashboard" className="hover:text-gray-900 transition-colors">Dashboard</Link>
        <span>/</span>
        <Link href="/marketplace" className="hover:text-gray-900 transition-colors">Marketplace</Link>
        <span>/</span>
        <span className="text-gray-800 truncate">{project.title}</span>
      </div>

      <ProjectWorkspaceInteractive project={project} currentUser={user} />
    </div>
  );
}
