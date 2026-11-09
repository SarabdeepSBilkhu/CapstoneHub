import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { mockDb } from '@/lib/mock-db';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import {
  FolderGit2,
  Calendar,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Award,
  AlertCircle,
  FileCheck2,
  Upload,
  PlusCircle,
  Users,
  ShieldCheck,
  Building2,
  FileText,
  Activity,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { DashboardRoleActions } from './dashboard-role-actions';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  let allProjects: any[] = [];

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
  } catch {
    // fallback
  }

  if (allProjects.length === 0) {
    await mockDb.init();
    allProjects = mockDb.projects;
  }

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
    activeProject = allProjects.find((p) => p.id === 'smart-campus-nav') || allProjects[0];
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <DashboardRoleActions user={user} project={activeProject} allProjects={allProjects} />
    </div>
  );
}
