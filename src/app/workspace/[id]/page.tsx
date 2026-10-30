import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { mockDb } from '@/lib/mock-db';
import { getCurrentUser } from '@/lib/auth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  FolderGit2,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Award,
  AlertCircle,
  FileCheck2,
  ExternalLink,
  Github,
  Building2,
  ShieldCheck,
  User,
  Users,
  Layers,
  FileText,
  Lock,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { ProjectWorkspaceInteractive } from './workspace-interactive';

interface WorkspaceProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectWorkspacePage({ params }: WorkspaceProps) {
  const { id } = await params;
  const user = await getCurrentUser();

  let project: any = null;

  try {
    project = await prisma.project.findUnique({
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
  } catch {
    // fallback
  }

  if (!project) {
    await mockDb.init();
    project = mockDb.projects.find((p) => p.id === id || p.id === 'smart-campus-nav');
  }

  if (!project) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center gap-2 text-xs text-zinc-400">
        <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
        <span>/</span>
        <Link href="/marketplace" className="hover:text-white transition-colors">Marketplace</Link>
        <span>/</span>
        <span className="text-zinc-200 truncate">{project.title}</span>
      </div>

      <ProjectWorkspaceInteractive project={project} currentUser={user} />
    </div>
  );
}

