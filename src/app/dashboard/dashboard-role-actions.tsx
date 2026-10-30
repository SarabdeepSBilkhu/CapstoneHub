'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/context/toast-context';
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
  Code,
} from 'lucide-react';

interface Props {
  user: any;
  project: any;
  allProjects: any[];
}

export function DashboardRoleActions({ user, project: initialProject, allProjects: initialAllProjects }: Props) {
  const { toast } = useToast();
  const [project, setProject] = useState(initialProject);
  const [allProjects, setAllProjects] = useState(initialAllProjects);

  // Sponsor: Create Opportunity Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('AI Autonomous Campus Delivery Rover');
  const [newDesc, setNewDesc] = useState('Autonomous robotic payload delivery across university pedestrian networks.');
  const [newProblem, setNewProblem] = useState('Inter-departmental mail and lab specimen logistics encounter delays. An autonomous low-speed rover platform bridges campus logistics.');
  const [newSkills, setNewSkills] = useState('ROS2, Python, Next.js, WebSockets, Embedded C++');
  const [newOutcomes, setNewOutcomes] = useState('Working prototype rover with GPS path-following web control dashboard.');
  const [isCreatingProject, setIsCreatingProject] = useState(false);

  // Admin: Approve/Reject action
  const [isProcessingApproval, setIsProcessingApproval] = useState(false);

  // Admin/Supervisor: Team allocation action
  const [isAllocatingTeam, setIsAllocatingTeam] = useState(false);

  const role = user.role;
  const totalMilestones = project.milestones?.length || 0;
  const approvedMilestones = project.milestones?.filter((m: any) => m.status === 'APPROVED').length || 0;
  const progressPercent = totalMilestones > 0 ? Math.round((approvedMilestones / totalMilestones) * 100) : 0;

  // Step 1: Sponsor Creates Project
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingProject(true);
    try {
      const res = await fetch('/api/projects/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          description: newDesc,
          problemStatement: newProblem,
          requiredSkills: newSkills.split(',').map((s) => s.trim()),
          expectedOutcomes: newOutcomes,
          category: 'INDUSTRY_SPONSORED',
          ipStatus: 'CONFIDENTIAL',
          tags: ['Autonomous Rover', 'Next.js', 'Robotics'],
          maxTeamSize: 4,
          applicationDeadline: '2026-11-20T23:59:59.000Z',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit project');

      toast(data.message || 'Project opportunity created and pending Admin approval!', 'success');
      setShowCreateModal(false);
      setAllProjects((prev) => [data.project, ...prev]);
    } catch (err: any) {
      toast(err.message, 'error');
    } finally {
      setIsCreatingProject(false);
    }
  };

  // Step 2: Admin Approves / Rejects Project
  const handleApproveProject = async (pId: string, action: 'APPROVE' | 'REJECT') => {
    setIsProcessingApproval(true);
    try {
      const res = await fetch('/api/projects/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: pId, action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Action failed');

      toast(data.message || 'Project status updated!', 'success');
      setAllProjects((prev) =>
        prev.map((p) => (p.id === pId ? { ...p, status: action === 'APPROVE' ? 'APPROVED' : 'ARCHIVED' } : p))
      );
      if (project.id === pId) {
        setProject((prev: any) => ({ ...prev, status: action === 'APPROVE' ? 'APPROVED' : 'ARCHIVED' }));
      }
    } catch (err: any) {
      toast(err.message, 'error');
    } finally {
      setIsProcessingApproval(false);
    }
  };

  // Step 4: Admin / Supervisor Allocates Team
  const handleAllocateTeam = async (pId: string, appId: string) => {
    setIsAllocatingTeam(true);
    try {
      const res = await fetch('/api/projects/allocate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: pId, selectedApplicationId: appId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Allocation failed');

      toast(data.message || 'Team successfully allocated!', 'success');
      setProject((prev: any) => ({
        ...prev,
        status: 'ALLOCATED',
        applications: prev.applications.map((a: any) => ({
          ...a,
          status: a.id === appId ? 'ACCEPTED' : 'REJECTED',
        })),
      }));
    } catch (err: any) {
      toast(err.message, 'error');
    } finally {
      setIsAllocatingTeam(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Welcome back, {user.name}
            </h1>
            <Badge
              variant={
                role === 'STUDENT'
                  ? 'purple'
                  : role === 'SUPERVISOR'
                  ? 'info'
                  : role === 'EXAMINER'
                  ? 'warning'
                  : role === 'SPONSOR'
                  ? 'default'
                  : 'danger'
              }
            >
              {role} WORKSPACE
            </Badge>
          </div>
          <p className="mt-1 text-sm text-zinc-400">
            {user.department || 'Department of Computer Science & Engineering'} •{' '}
            {role === 'STUDENT' && 'Capstone Deliverables & Team Wayfinding Workspace'}
            {role === 'SUPERVISOR' && 'Project Supervision, Bi-Weekly Logs & Approvals'}
            {role === 'EXAMINER' && '6-Criteria Rubric Assessment & Viva Grading'}
            {role === 'SPONSOR' && 'Industry Challenge Portfolio & IP Agreement Oversight'}
            {role === 'ADMIN' && 'Academic Deanery Capstone Accreditation & Analytics'}
          </p>
        </div>

        {/* Dynamic Buttons */}
        <div className="flex items-center gap-3">
          {role === 'SPONSOR' && (
            <Button variant="primary" size="sm" onClick={() => setShowCreateModal(true)}>
              <PlusCircle className="w-4 h-4 mr-1.5" /> Post New Problem Statement
            </Button>
          )}

          <Link href={`/workspace/${project.id}`}>
            <Button variant="outline" size="sm">
              <FolderGit2 className="w-4 h-4 mr-1.5" /> Open Project Workspace
            </Button>
          </Link>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 1. STUDENT VIEW                                              */}
      {/* ============================================================ */}
      {role === 'STUDENT' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-indigo-900/30 bg-indigo-950/20">
              <CardContent className="pt-6">
                <p className="text-xs font-medium text-zinc-400">Allocated Capstone</p>
                <h4 className="mt-1 text-lg font-bold text-white truncate">{project.title}</h4>
                <div className="mt-3">
                  <Badge variant="info">{project.category.replace('_', ' ')}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <p className="text-xs font-medium text-zinc-400">Milestone Progress</p>
                <h4 className="mt-1 text-2xl font-bold text-white">{progressPercent}%</h4>
                <div className="mt-3 w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${progressPercent}%` }} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <p className="text-xs font-medium text-zinc-400">Originality Report</p>
                <h4 className="mt-1 text-2xl font-bold text-white">12.0%</h4>
                <p className="mt-3 text-xs text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Similarity Verified (&lt;15%)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <p className="text-xs font-medium text-zinc-400">Supervisor Meeting</p>
                <h4 className="mt-1 text-lg font-bold text-white">Logged & Active</h4>
                <p className="mt-3 text-xs text-amber-400">Action Items Synced</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Milestone Deliverables Status</CardTitle>
                    <CardDescription>Track submission links and supervisor feedback</CardDescription>
                  </div>
                  <Link href={`/workspace/${project.id}`}>
                    <Button variant="outline" size="sm">Go to Submissions</Button>
                  </Link>
                </CardHeader>
                <CardContent className="space-y-4">
                  {project.milestones?.map((m: any, idx: number) => (
                    <div key={m.id} className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white text-sm">{idx + 1}. {m.title}</span>
                        <Badge variant={m.status === 'APPROVED' ? 'success' : m.status === 'SUBMITTED' ? 'info' : 'warning'}>
                          {m.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-xs text-zinc-400">{m.description}</p>
                      {m.feedback && (
                        <div className="text-xs text-indigo-300 bg-indigo-950/30 p-2.5 rounded-lg border border-indigo-900/40">
                          <strong>Supervisor Feedback:</strong> {m.feedback}
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Your Team Roster</CardTitle>
                  <CardDescription className="truncate">{project.allocatedTeam?.name || 'GeoPath Innovators'}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-950/40">
                    <div className="text-xs">
                      <p className="font-semibold text-white">Alex Chen</p>
                      <p className="text-[11px] text-zinc-400">student@capstonehub.edu</p>
                    </div>
                    <Badge variant="purple">Leader</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-950/40">
                    <div className="text-xs">
                      <p className="font-semibold text-white">Maya Patel</p>
                      <p className="text-[11px] text-zinc-400">maya@capstonehub.edu</p>
                    </div>
                    <span className="text-xs text-zinc-400">Member</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. SUPERVISOR VIEW                                           */}
      {/* ============================================================ */}
      {role === 'SUPERVISOR' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-sky-900/40 bg-sky-950/20">
              <CardContent className="pt-6">
                <p className="text-xs font-medium text-zinc-400">Supervised Cohorts</p>
                <h4 className="mt-1 text-2xl font-bold text-white">{allProjects.length} Teams</h4>
                <p className="mt-3 text-xs text-sky-400">Smart Campus IoT Track</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <p className="text-xs font-medium text-zinc-400">Milestones Reviewed</p>
                <h4 className="mt-1 text-2xl font-bold text-white">{approvedMilestones} / {totalMilestones}</h4>
                <p className="mt-3 text-xs text-emerald-400">100% On-Track</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <p className="text-xs font-medium text-zinc-400">Meeting Logs Recorded</p>
                <h4 className="mt-1 text-2xl font-bold text-white">{project.supervisorLogs?.length || 2}</h4>
                <p className="mt-3 text-xs text-emerald-400">Bi-Weekly Audits Complete</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <p className="text-xs font-medium text-zinc-400">Avg Satisfaction Rating</p>
                <h4 className="mt-1 text-2xl font-bold text-white">5.0 / 5</h4>
                <p className="mt-3 text-xs text-amber-400">Exemplary Progress</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Supervised Project Portfolio</CardTitle>
                <CardDescription>Direct access to meeting logs, deliverable approvals, and reviews</CardDescription>
              </div>
              <Link href={`/workspace/${project.id}`}>
                <Button variant="primary" size="sm">
                  <FolderGit2 className="w-4 h-4 mr-1.5" /> Open Supervision Workspace
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-white">{project.title}</h4>
                  <Badge variant="success">{project.status}</Badge>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">{project.problemStatement}</p>
                <div className="border-t border-zinc-800 pt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-zinc-400">Allocated Team: {project.allocatedTeam?.name}</span>
                  <div className="flex items-center gap-2">
                    <Link href={`/workspace/${project.id}`}>
                      <Button variant="outline" size="sm">Record Meeting Minutes</Button>
                    </Link>
                    <Link href={`/workspace/${project.id}`}>
                      <Button variant="secondary" size="sm">Review Submissions</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. EXAMINER VIEW                                             */}
      {/* ============================================================ */}
      {role === 'EXAMINER' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-purple-900/40 bg-purple-950/20">
              <CardContent className="pt-6">
                <p className="text-xs font-medium text-zinc-400">Assigned Cohorts</p>
                <h4 className="mt-1 text-2xl font-bold text-white">1 Capstone Defense</h4>
                <p className="mt-3 text-xs text-purple-400">Independent Assessment</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <p className="text-xs font-medium text-zinc-400">Independent Evaluators</p>
                <h4 className="mt-1 text-2xl font-bold text-white">3 Examiners</h4>
                <p className="mt-3 text-xs text-emerald-400">All 3 Scored & Submitted</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <p className="text-xs font-medium text-zinc-400">Calculated Final Score</p>
                <h4 className="mt-1 text-2xl font-bold text-white">94.5 / 100</h4>
                <p className="mt-3 text-xs text-amber-400">Distinction Grade (A+)</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <p className="text-xs font-medium text-zinc-400">Originality Clearance</p>
                <h4 className="mt-1 text-2xl font-bold text-white">12.0%</h4>
                <p className="mt-3 text-xs text-zinc-400">Similarity Verified</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Examiner Rubrics Sheet</CardTitle>
                <CardDescription>Standardized 6-criteria marksheet with radar visualization</CardDescription>
              </div>
              <Link href="/evaluation">
                <Button variant="primary" size="sm">
                  <FileCheck2 className="w-4 h-4 mr-1.5" /> Open Rubric Grading Tool
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-white text-sm">{project.title}</h4>
                  <Badge variant="purple">Average: 94.5 / 100</Badge>
                </div>
                <p className="text-xs text-zinc-400">
                  Team: {project.allocatedTeam?.name} • Supervisor: {project.supervisor?.name}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. SPONSOR VIEW                                              */}
      {/* ============================================================ */}
      {role === 'SPONSOR' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-amber-900/40 bg-amber-950/20">
              <CardContent className="pt-6">
                <p className="text-xs font-medium text-zinc-400">Organization Profile</p>
                <h4 className="mt-1 text-xl font-bold text-white truncate">Steerpath Smart IoT</h4>
                <p className="mt-3 text-xs text-amber-400">Industry Partner</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <p className="text-xs font-medium text-zinc-400">Active Challenge Statements</p>
                <h4 className="mt-1 text-2xl font-bold text-white">{allProjects.length} Opportunities</h4>
                <p className="mt-3 text-xs text-zinc-400">Smart Campus Navigation</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <p className="text-xs font-medium text-zinc-400">NDA Governance</p>
                <h4 className="mt-1 text-2xl font-bold text-white">CONFIDENTIAL</h4>
                <p className="mt-3 text-xs text-emerald-400">Steerpath IP Agreement Enforced</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <p className="text-xs font-medium text-zinc-400">Allocated Engineering Cohort</p>
                <h4 className="mt-1 text-base font-bold text-white truncate leading-tight">{project.allocatedTeam?.name}</h4>
                <p className="mt-3 text-xs text-indigo-400">Deliverables Completed</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Your Sponsored Opportunity: {project.title}</CardTitle>
                <CardDescription>Track university milestone completion and publication clearance</CardDescription>
              </div>
              <Button variant="primary" size="sm" onClick={() => setShowCreateModal(true)}>
                <PlusCircle className="w-4 h-4 mr-1.5" /> Post New Problem
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-white">{project.title}</h4>
                  <Badge variant="warning">{project.ipStatus}</Badge>
                </div>
                <p className="text-xs text-zinc-300">{project.problemStatement}</p>
                <div className="border-t border-zinc-800 pt-3 flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Faculty Supervisor: {project.supervisor?.name}</span>
                  <Link href={`/workspace/${project.id}`}>
                    <Button variant="outline" size="sm">View Workspace & IP Records</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ============================================================ */}
      {/* 5. ADMIN VIEW (Step 2 & Step 4 Central Overview)             */}
      {/* ============================================================ */}
      {role === 'ADMIN' && (
        <div className="space-y-8">
          {/* Institutional Overview Statistics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="border-rose-900/40 bg-rose-950/20">
              <CardContent className="pt-6">
                <p className="text-xs font-medium text-zinc-400">Total Students</p>
                <h4 className="mt-1 text-3xl font-extrabold text-white">128</h4>
                <p className="mt-2 text-xs text-rose-400">CSE Department</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <p className="text-xs font-medium text-zinc-400">Active Projects</p>
                <h4 className="mt-1 text-3xl font-extrabold text-white">32</h4>
                <p className="mt-2 text-xs text-indigo-400">In Progress / Allocated</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <p className="text-xs font-medium text-zinc-400">Industry Sponsors</p>
                <h4 className="mt-1 text-3xl font-extrabold text-white">8</h4>
                <p className="mt-2 text-xs text-amber-400">Steerpath, NovaLabs, etc.</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <p className="text-xs font-medium text-zinc-400">Pending Approvals</p>
                <h4 className="mt-1 text-3xl font-extrabold text-white">12</h4>
                <p className="mt-2 text-xs text-emerald-400">Requires Committee Sign-off</p>
              </CardContent>
            </Card>
          </div>

          {/* Step 2: Administrator Approves / Rejects Project Proposals */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Administrator Project Approval Gate</CardTitle>
                <CardDescription>
                  Review submitted industry problem statements before releasing to the student marketplace
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {allProjects.map((p) => (
                <div key={p.id} className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-white text-sm">{p.title}</h4>
                        <Badge variant={p.status === 'APPROVED' ? 'success' : p.status === 'ALLOCATED' ? 'purple' : 'warning'}>
                          {p.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-zinc-400">Sponsor: {p.sponsor?.name || 'Steerpath'}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {p.status === 'PENDING_APPROVAL' ? (
                        <>
                          <Button
                            size="sm"
                            variant="primary"
                            isLoading={isProcessingApproval}
                            onClick={() => handleApproveProject(p.id, 'APPROVE')}
                          >
                            Approve Statement
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            isLoading={isProcessingApproval}
                            onClick={() => handleApproveProject(p.id, 'REJECT')}
                          >
                            Reject
                          </Button>
                        </>
                      ) : (
                        <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approved for Marketplace
                        </span>
                      )}
                      <Link href={`/workspace/${p.id}`}>
                        <Button size="sm" variant="outline">Inspect Details</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Step 4: Competing Team Applications & Allocation Review */}
          <Card>
            <CardHeader>
              <CardTitle>Competing Team Applications Review & Allocation</CardTitle>
              <CardDescription>
                Review proposals from 2 competing student teams for &quot;Smart Campus Navigation System&quot;
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.applications?.map((app: any) => (
                  <div key={app.id} className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-white text-sm">{app.teamName}</h4>
                        <p className="text-[11px] text-zinc-400">Team Lead: {app.leaderName}</p>
                      </div>
                      <Badge
                        variant={
                          app.status === 'ACCEPTED'
                            ? 'success'
                            : app.status === 'REJECTED'
                            ? 'danger'
                            : 'warning'
                        }
                      >
                        {app.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-zinc-300 bg-zinc-900/50 p-3 rounded-lg border border-zinc-800">
                      <strong>Submitted Proposal:</strong> {app.proposal}
                    </p>
                    {(app.status === 'PENDING' || app.status === 'ACCEPTED') && (
                      <div className="flex items-center gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="primary"
                          isLoading={isAllocatingTeam}
                          onClick={() => handleAllocateTeam(project.id, app.id)}
                        >
                          {app.status === 'ACCEPTED' ? '✓ Allocated — Re-Allocate' : 'Accept Team & Allocate Project'}
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Sponsor Modal: Step 1 (Create Project Opportunity) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <Card className="max-w-xl w-full bg-zinc-900 border-zinc-700 space-y-4 my-8">
            <CardHeader>
              <CardTitle>Sponsor Project Opportunity Formulation</CardTitle>
              <CardDescription>
                Define industry problem statements, technical constraints, team requirements, and IP terms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateProject} className="space-y-3 text-xs">
                <Input
                  label="Project Title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-zinc-300 mb-1">
                    Problem Statement & Background
                  </label>
                  <textarea
                    rows={3}
                    value={newProblem}
                    onChange={(e) => setNewProblem(e.target.value)}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-950 p-2.5 text-zinc-200"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-zinc-300 mb-1">
                    Description & Objectives
                  </label>
                  <textarea
                    rows={2}
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-950 p-2.5 text-zinc-200"
                  />
                </div>
                <Input
                  label="Required Skills (Comma separated)"
                  value={newSkills}
                  onChange={(e) => setNewSkills(e.target.value)}
                />
                <Input
                  label="Expected Deliverable Outcomes"
                  value={newOutcomes}
                  onChange={(e) => setNewOutcomes(e.target.value)}
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Max Team Size" type="number" defaultValue={4} />
                  <Input label="Application Deadline" type="date" defaultValue="2026-11-20" />
                </div>
                <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-900/50 text-[11px] text-amber-300">
                  <strong>Confidentiality Notice:</strong> Submission enforces Steerpath standard NDA and initial status
                  will be set to <code>PENDING_APPROVAL</code>.
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button variant="ghost" size="sm" type="button" onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" type="submit" isLoading={isCreatingProject}>
                    Submit Opportunity for Admin Review
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

