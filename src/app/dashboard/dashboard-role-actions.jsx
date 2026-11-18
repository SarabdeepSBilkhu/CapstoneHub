'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/context/toast-context';
import {
  FolderGit2,
  CheckCircle2,
  FileCheck2,
  Upload,
  PlusCircle,
  Trash2,
} from 'lucide-react';

export function DashboardRoleActions({ user, project: initialProject, allProjects: initialAllProjects }) {
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

  // Admin: Delete Project action
  const [deletingProjectId, setDeletingProjectId] = useState(null);

  const role = user.role;
  const totalMilestones = project.milestones?.length || 0;
  const approvedMilestones = project.milestones?.filter((m) => m.status === 'APPROVED').length || 0;
  const progressPercent = totalMilestones > 0 ? Math.round((approvedMilestones / totalMilestones) * 100) : 0;

  // Real calculated admin statistics
  const pendingApprovalsCount = allProjects.filter((p) => p.status === 'PENDING_APPROVAL').length;
  const activeProjectsCount = allProjects.filter(
    (p) => p.status === 'APPROVED' || p.status === 'ALLOCATED' || p.status === 'IN_PROGRESS'
  ).length;

  const uniqueSponsorsCount = new Set(
    allProjects
      .map((p) => p.sponsor?.name || p.sponsorId)
      .filter(Boolean)
  ).size;

  const totalStudentsCount = allProjects.reduce((acc, p) => {
    const memberCount = p.allocatedTeam?.members?.length || (p.allocatedTeamId ? 2 : 0);
    return acc + memberCount;
  }, 0);

  const allProjectEvaluations = project.evaluations || [];
  const calculatedExaminerAvg = allProjectEvaluations.length > 0
    ? (allProjectEvaluations.reduce((sum, e) => sum + (e.totalScore || 0), 0) / allProjectEvaluations.length).toFixed(1)
    : '0.0';
  const submittedEvaluationsCount = allProjectEvaluations.filter((e) => e.isSubmitted).length;

  // Step 1: Sponsor Creates Project
  const handleCreateProject = async (e) => {
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
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setIsCreatingProject(false);
    }
  };

  // Step 2: Admin Approves / Rejects Project
  const handleApproveProject = async (pId, action) => {
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
        setProject((prev) => ({ ...prev, status: action === 'APPROVE' ? 'APPROVED' : 'ARCHIVED' }));
      }
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setIsProcessingApproval(false);
    }
  };

  // Step 4: Admin / Supervisor Allocates Team
  const handleAllocateTeam = async (pId, appId) => {
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
      setProject((prev) => ({
        ...prev,
        status: 'ALLOCATED',
        applications: prev.applications.map((a) => ({
          ...a,
          status: a.id === appId ? 'ACCEPTED' : 'REJECTED',
        })),
      }));
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setIsAllocatingTeam(false);
    }
  };

  const handleDeleteProject = async (projectId, projectTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${projectTitle}"? This cannot be undone.`)) {
      return;
    }
    setDeletingProjectId(projectId);
    try {
      const res = await fetch('/api/projects/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Delete failed');

      toast(`Project "${projectTitle}" deleted permanently`, 'success');
      setAllProjects((prev) => prev.filter((p) => p.id !== projectId));
      if (project.id === projectId) {
        const remaining = allProjects.filter((p) => p.id !== projectId);
        if (remaining.length > 0) setProject(remaining[0]);
      }
    } catch (err) {
      toast(err.message || 'Failed to delete project', 'error');
    } finally {
      setDeletingProjectId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
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
              {role}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {user.department || 'Department of Computer Science & Engineering'} •{' '}
            {role === 'STUDENT' && 'Capstone Deliverables & Team Workspace'}
            {role === 'SUPERVISOR' && 'Project Supervision, Bi-Weekly Logs & Approvals'}
            {role === 'EXAMINER' && 'Rubric Assessment & Viva Grading'}
            {role === 'SPONSOR' && 'Industry Challenge Portfolio & IP Oversight'}
            {role === 'ADMIN' && 'Capstone Program Administration & Analytics'}
          </p>
        </div>

        {/* Dynamic Buttons */}
        <div className="flex items-center gap-2">
          {role === 'SPONSOR' && (
            <Button variant="primary" size="sm" onClick={() => setShowCreateModal(true)}>
              <PlusCircle className="w-4 h-4 mr-1.5" /> Post Problem Statement
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
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="shadow-none border-gray-200">
              <CardContent className="pt-5">
                <p className="text-xs font-medium text-gray-500">Allocated Capstone</p>
                <h4 className="mt-1 text-base font-bold text-gray-900 truncate">{project.title}</h4>
                <div className="mt-2.5">
                  <Badge variant="info">{project.category.replace(/_/g, ' ')}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-none border-gray-200">
              <CardContent className="pt-5">
                <p className="text-xs font-medium text-gray-500">Milestone Progress</p>
                <h4 className="mt-1 text-2xl font-bold text-gray-900">{progressPercent}%</h4>
                <div className="mt-3 w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${progressPercent}%` }} />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-none border-gray-200">
              <CardContent className="pt-5">
                <p className="text-xs font-medium text-gray-500">Originality Report</p>
                <h4 className="mt-1 text-2xl font-bold text-gray-900">12.0%</h4>
                <p className="mt-2 text-xs text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Similarity Verified (&lt;15%)
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-none border-gray-200">
              <CardContent className="pt-5">
                <p className="text-xs font-medium text-gray-500">Supervisor Meeting</p>
                <h4 className="mt-1 text-base font-bold text-gray-900">Logged & Active</h4>
                <p className="mt-2 text-xs text-amber-600">Action Items Synced</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-none border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <div>
                    <CardTitle>Milestone Deliverables</CardTitle>
                    <CardDescription>Track submission links and supervisor feedback</CardDescription>
                  </div>
                  <Link href={`/workspace/${project.id}?tab=MILESTONES`}>
                    <Button variant="primary" size="sm">
                      <Upload className="w-3.5 h-3.5 mr-1.5" /> Submit Deliverables
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent className="space-y-3">
                  {project.milestones?.map((m, idx) => (
                    <div key={m.id} className="p-3.5 rounded-lg border border-gray-200 bg-gray-50/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900 text-sm">{idx + 1}. {m.title}</span>
                        <Badge variant={m.status === 'APPROVED' ? 'success' : m.status === 'SUBMITTED' ? 'info' : 'warning'}>
                          {m.status.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500">{m.description}</p>
                      {m.feedback && (
                        <div className="text-xs text-indigo-700 bg-indigo-50 p-2.5 rounded border border-indigo-100">
                          <strong>Supervisor Feedback:</strong> {m.feedback}
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="shadow-none border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle>Team Roster</CardTitle>
                  <CardDescription className="truncate">{project.allocatedTeam?.name || 'GeoPath Innovators'}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  <div className="flex items-center justify-between p-2.5 rounded border border-gray-100 bg-gray-50">
                    <div className="text-xs">
                      <p className="font-semibold text-gray-900">Alex Chen</p>
                      <p className="text-[11px] text-gray-500">student@capstonehub.edu</p>
                    </div>
                    <Badge variant="purple">Leader</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded border border-gray-100 bg-gray-50">
                    <div className="text-xs">
                      <p className="font-semibold text-gray-900">Maya Patel</p>
                      <p className="text-[11px] text-gray-500">maya@capstonehub.edu</p>
                    </div>
                    <span className="text-xs text-gray-400">Member</span>
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
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="shadow-none border-gray-200">
              <CardContent className="pt-5">
                <p className="text-xs font-medium text-gray-500">Supervised Cohorts</p>
                <h4 className="mt-1 text-2xl font-bold text-gray-900">{allProjects.length} Teams</h4>
                <p className="mt-2 text-xs text-blue-600">Smart Campus IoT Track</p>
              </CardContent>
            </Card>

            <Card className="shadow-none border-gray-200">
              <CardContent className="pt-5">
                <p className="text-xs font-medium text-gray-500">Milestones Reviewed</p>
                <h4 className="mt-1 text-2xl font-bold text-gray-900">{approvedMilestones} / {totalMilestones}</h4>
                <p className="mt-2 text-xs text-emerald-600">On Track</p>
              </CardContent>
            </Card>

            <Card className="shadow-none border-gray-200">
              <CardContent className="pt-5">
                <p className="text-xs font-medium text-gray-500">Meeting Logs Recorded</p>
                <h4 className="mt-1 text-2xl font-bold text-gray-900">{project.supervisorLogs?.length || 2}</h4>
                <p className="mt-2 text-xs text-emerald-600">Audits Complete</p>
              </CardContent>
            </Card>

            <Card className="shadow-none border-gray-200">
              <CardContent className="pt-5">
                <p className="text-xs font-medium text-gray-500">Avg Satisfaction Rating</p>
                <h4 className="mt-1 text-2xl font-bold text-gray-900">5.0 / 5</h4>
                <p className="mt-2 text-xs text-amber-600">Exemplary Progress</p>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-none border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle>Supervised Project Portfolio</CardTitle>
                <CardDescription>Meeting logs, deliverable approvals, and reviews</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {allProjects
                .filter((p) => p.supervisorId === user.id || p.supervisor?.id === user.id || p.supervisor?.email === user.email || allProjects.length === 1)
                .map((p) => (
                  <div key={p.id} className="p-4 rounded-lg border border-gray-200 bg-white space-y-2.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-base font-semibold text-gray-900">{p.title}</h4>
                      <Badge variant="success">{p.status}</Badge>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{p.problemStatement}</p>
                    <div className="border-t border-gray-100 pt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="text-gray-500">Allocated Team: {p.allocatedTeam?.name || 'Unassigned'}</span>
                      <div className="flex items-center gap-2">
                        <Link href={`/workspace/${p.id}?tab=MEETINGS`}>
                          <Button variant="outline" size="sm">Record Meeting Minutes</Button>
                        </Link>
                        <Link href={`/workspace/${p.id}?tab=MILESTONES`}>
                          <Button variant="secondary" size="sm">Review Submissions</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. EXAMINER VIEW                                             */}
      {/* ============================================================ */}
      {role === 'EXAMINER' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="shadow-none border-gray-200">
              <CardContent className="pt-5">
                <p className="text-xs font-medium text-gray-500">Assigned Defenses</p>
                <h4 className="mt-1 text-2xl font-bold text-gray-900">{allProjects.length}</h4>
                <p className="mt-2 text-xs text-indigo-600">Assessment Track</p>
              </CardContent>
            </Card>

            <Card className="shadow-none border-gray-200">
              <CardContent className="pt-5">
                <p className="text-xs font-medium text-gray-500">Evaluators</p>
                <h4 className="mt-1 text-2xl font-bold text-gray-900">{allProjectEvaluations.length} Examiners</h4>
                <p className="mt-2 text-xs text-emerald-600">{submittedEvaluationsCount} Scored</p>
              </CardContent>
            </Card>

            <Card className="shadow-none border-gray-200">
              <CardContent className="pt-5">
                <p className="text-xs font-medium text-gray-500">Calculated Final Score</p>
                <h4 className="mt-1 text-2xl font-bold text-gray-900">{calculatedExaminerAvg} / 100</h4>
                <p className="mt-2 text-xs text-amber-600">Composite</p>
              </CardContent>
            </Card>

            <Card className="shadow-none border-gray-200">
              <CardContent className="pt-5">
                <p className="text-xs font-medium text-gray-500">Originality Clearance</p>
                <h4 className="mt-1 text-2xl font-bold text-gray-900">{project.similarityScore ?? 12.0}%</h4>
                <p className="mt-2 text-xs text-emerald-600">Verified</p>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-none border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
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
              <div className="p-3.5 rounded-lg border border-gray-200 bg-gray-50 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900 text-sm">{project.title}</h4>
                  <Badge variant="purple">Average: {calculatedExaminerAvg} / 100</Badge>
                </div>
                <p className="text-xs text-gray-500">
                  Team: {project.allocatedTeam?.name || 'Unassigned'} • Supervisor: {project.supervisor?.name || 'Assigned Faculty'}
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
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="shadow-none border-gray-200">
              <CardContent className="pt-5">
                <p className="text-xs font-medium text-gray-500">Organization</p>
                <h4 className="mt-1 text-lg font-bold text-gray-900 truncate">Steerpath Smart IoT</h4>
                <p className="mt-2 text-xs text-amber-600">Industry Partner</p>
              </CardContent>
            </Card>

            <Card className="shadow-none border-gray-200">
              <CardContent className="pt-5">
                <p className="text-xs font-medium text-gray-500">Active Challenge Statements</p>
                <h4 className="mt-1 text-2xl font-bold text-gray-900">{allProjects.length}</h4>
                <p className="mt-2 text-xs text-gray-500">Smart Campus Navigation</p>
              </CardContent>
            </Card>

            <Card className="shadow-none border-gray-200">
              <CardContent className="pt-5">
                <p className="text-xs font-medium text-gray-500">NDA Governance</p>
                <h4 className="mt-1 text-base font-bold text-gray-900">CONFIDENTIAL</h4>
                <p className="mt-2 text-xs text-emerald-600">IP Agreement Enforced</p>
              </CardContent>
            </Card>

            <Card className="shadow-none border-gray-200">
              <CardContent className="pt-5">
                <p className="text-xs font-medium text-gray-500">Allocated Cohort</p>
                <h4 className="mt-1 text-base font-bold text-gray-900 truncate leading-tight">{project.allocatedTeam?.name || 'Pending'}</h4>
                <p className="mt-2 text-xs text-indigo-600">Deliverables In Progress</p>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-none border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle>Sponsored Opportunity: {project.title}</CardTitle>
                <CardDescription>Track university milestone completion and publication clearance</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-4 rounded-lg border border-gray-200 bg-gray-50 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-900">{project.title}</h4>
                  <Badge variant="warning">{project.ipStatus}</Badge>
                </div>
                <p className="text-xs text-gray-600">{project.problemStatement}</p>
                <div className="border-t border-gray-200 pt-2.5 flex items-center justify-between text-xs">
                  <span className="text-gray-500">Faculty Supervisor: {project.supervisor?.name || 'Assigned'}</span>
                  <Link href={`/workspace/${project.id}`}>
                    <Button variant="outline" size="sm">View Workspace</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ============================================================ */}
      {/* 5. ADMIN VIEW                                                */}
      {/* ============================================================ */}
      {role === 'ADMIN' && (
        <div className="space-y-6">
          {/* Institutional Overview Statistics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="shadow-none border-gray-200">
              <CardContent className="pt-5">
                <p className="text-xs font-medium text-gray-500">Total Students</p>
                <h4 className="mt-1 text-2xl font-bold text-gray-900">{totalStudentsCount}</h4>
                <p className="mt-2 text-xs text-gray-500">Allocated in cohorts</p>
              </CardContent>
            </Card>

            <Card className="shadow-none border-gray-200">
              <CardContent className="pt-5">
                <p className="text-xs font-medium text-gray-500">Active Projects</p>
                <h4 className="mt-1 text-2xl font-bold text-gray-900">{activeProjectsCount}</h4>
                <p className="mt-2 text-xs text-indigo-600">Approved & in progress</p>
              </CardContent>
            </Card>

            <Card className="shadow-none border-gray-200">
              <CardContent className="pt-5">
                <p className="text-xs font-medium text-gray-500">Sponsors & Partners</p>
                <h4 className="mt-1 text-2xl font-bold text-gray-900">{uniqueSponsorsCount}</h4>
                <p className="mt-2 text-xs text-amber-600">Active challenge partners</p>
              </CardContent>
            </Card>

            <Card className="shadow-none border-gray-200">
              <CardContent className="pt-5">
                <p className="text-xs font-medium text-gray-500">Pending Approvals</p>
                <h4 className="mt-1 text-2xl font-bold text-gray-900">{pendingApprovalsCount}</h4>
                <p className="mt-2 text-xs text-emerald-600">
                  {pendingApprovalsCount === 0 ? 'All cleared' : 'Requires sign-off'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Project Approvals */}
          <Card className="shadow-none border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle>Project Approvals</CardTitle>
                <CardDescription>
                  Review submitted industry problem statements before releasing to the marketplace
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {allProjects.map((p) => (
                <div key={p.id} className="p-3.5 rounded-lg border border-gray-200 bg-white space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900 text-sm">{p.title}</h4>
                        <Badge variant={p.status === 'APPROVED' ? 'success' : p.status === 'ALLOCATED' ? 'purple' : 'warning'}>
                          {p.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500">Sponsor: {p.sponsor?.name || 'Steerpath'}</p>
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
                            Approve
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
                        <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                        </span>
                      )}
                      <Link href={`/workspace/${p.id}`}>
                        <Button size="sm" variant="outline">Inspect</Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-gray-400 hover:text-red-600 p-2"
                        title="Delete Project"
                        isLoading={deletingProjectId === p.id}
                        onClick={() => handleDeleteProject(p.id, p.title)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Allocation Review */}
          <Card className="shadow-none border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle>Team Applications & Allocation</CardTitle>
              <CardDescription>
                Review submissions and allocate projects across registered cohorts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {allProjects.some((p) => p.applications && p.applications.length > 0) ? (
                <div className="space-y-4">
                  {allProjects
                    .filter((p) => p.applications && p.applications.length > 0)
                    .map((p) => (
                      <div key={p.id} className="space-y-2 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900 text-sm">Applications for: {p.title}</h4>
                          <Badge variant="purple">{p.status}</Badge>
                        </div>
                        <div className="space-y-2.5">
                          {p.applications.map((app) => (
                            <div key={app.id} className="p-3.5 rounded-lg border border-gray-200 bg-gray-50/50 space-y-2">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-semibold text-gray-900 text-sm">{app.teamName}</h4>
                                  <p className="text-[11px] text-gray-500">Team Lead: {app.leaderName}</p>
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
                              <p className="text-xs text-gray-700 bg-white p-2.5 rounded border border-gray-200">
                                <strong>Proposal:</strong> {app.proposal}
                              </p>
                              {(app.status === 'PENDING' || app.status === 'ACCEPTED') && (
                                <div className="flex items-center gap-2 pt-1">
                                  <Button
                                    size="sm"
                                    variant="primary"
                                    isLoading={isAllocatingTeam}
                                    onClick={() => handleAllocateTeam(p.id, app.id)}
                                  >
                                    {app.status === 'ACCEPTED' ? '✓ Allocated — Re-Allocate' : 'Accept Team & Allocate'}
                                  </Button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 py-3 text-center">No pending cohort applications currently recorded.</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Sponsor Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 overflow-y-auto">
          <div className="max-w-xl w-full bg-white rounded-lg border border-gray-200 p-6 space-y-4 my-8 shadow-xl">
            <div>
              <h3 className="text-base font-semibold text-gray-900">Post Problem Statement</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Define the challenge statement, technical constraints, and deliverable outcomes
              </p>
            </div>
            <form onSubmit={handleCreateProject} className="space-y-3 text-xs">
              <Input
                label="Project Title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Problem Statement
                </label>
                <textarea
                  rows={3}
                  value={newProblem}
                  onChange={(e) => setNewProblem(e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description & Objectives
                </label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
              <Input
                label="Required Skills (comma separated)"
                value={newSkills}
                onChange={(e) => setNewSkills(e.target.value)}
              />
              <Input
                label="Expected Outcomes"
                value={newOutcomes}
                onChange={(e) => setNewOutcomes(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Max Team Size" type="number" defaultValue={4} />
                <Input label="Deadline" type="date" defaultValue="2026-11-20" />
              </div>
              <div className="p-2.5 rounded bg-amber-50 border border-amber-200 text-xs text-amber-800">
                <strong>Notice:</strong> Initial status will be set to <code>PENDING_APPROVAL</code> for admin review.
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <Button variant="ghost" size="sm" type="button" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" isLoading={isCreatingProject}>
                  Submit Opportunity
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
