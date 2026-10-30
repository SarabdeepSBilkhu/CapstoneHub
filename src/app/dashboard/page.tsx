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

  const activeProject =
    allProjects.find((p) => p.id === 'smart-campus-nav') || allProjects[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <DashboardRoleActions user={user} project={activeProject} allProjects={allProjects} />
    </div>
  );
}
