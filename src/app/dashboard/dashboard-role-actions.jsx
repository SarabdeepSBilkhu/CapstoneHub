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
  CheckCircle2,
  FileCheck2,
  Upload,
  PlusCircle,
  Trash2,
  Calendar,
  ExternalLink,
  Users,
  Building,
  ShieldCheck,
  Eye,
  X,
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

  // Student: Submit Deliverable Modal (dedicated functionality)
  const [studentSubmitMilestone, setStudentSubmitMilestone] = useState(null);
  const [deliverableUrl, setDeliverableUrl] = useState('https://github.com/capstonehub-demo/smart-campus-navigation/releases/tag/v1.0.0');
  const [isSubmittingDeliverable, setIsSubmittingDeliverable] = useState(false);

  // Supervisor: Record Meeting Minutes Modal (dedicated functionality)
  const [meetingModalProject, setMeetingModalProject] = useState(null);
  const [meetingDate, setMeetingDate] = useState(new Date().toISOString().split('T')[0]);
  const [discussionPoints, setDiscussionPoints] = useState('');
  const [actionItems, setActionItems] = useState('');
  const [satisfactionRating, setSatisfactionRating] = useState(5);
  const [isRecordingMeeting, setIsRecordingMeeting] = useState(false);

  // Supervisor: Review Submissions Modal (dedicated functionality)
  const [reviewModalProject, setReviewModalProject] = useState(null);
  const [supervisorFeedback, setSupervisorFeedback] = useState('Approved. Architecture and test benchmarks meet requirements.');
  const [isReviewingMilestone, setIsReviewingMilestone] = useState(false);

  // Admin: Inspect Project Details Modal (dedicated functionality)
  const [inspectModalProject, setInspectModalProject] = useState(null);

  // Admin: Approve/Reject action
  const [isProcessingApproval, setIsProcessingApproval] = useState(false);

  // Admin/Supervisor: Team allocation action
  const [isAllocatingTeam, setIsAllocatingTeam] = useState(false);
  const [isRejectingApp, setIsRejectingApp] = useState(false);

  // Admin: Delete Project action
  const [deletingProjectId, setDeletingProjectId] = useState(null);

  const role = user.role;
  const totalMilestones = project.milestones?.length || 0;
  const approvedMilestones = project.milestones?.filter((m) => m.status === 'APPROVED').length || 0;
  const progressPercent = totalMilestones > 0 ? Math.round((approvedMilestones / totalMilestones) * 100) : 0;

  // Real calculated admin statistics
  const pendingApprovalsCount = allProjects.filter((p) => p.status === 'PENDING_APPROVAL').length;
  const activeProjectsCount = allProjects.filter(
    (p) => p.status === 'APPROVED' || p.status === 'ALLOCATED' || p.status === 'IN_PROGRESS' || p.status === 'COMPLETED'
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

  // Change active project
  const handleSelectProject = (projectId) => {
    const found = allProjects.find((p) => p.id === projectId);
    if (found) {
      setProject(found);
    }
  };

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

  // Student: Submit Deliverable Action (Dedicated in-place functionality)
  const handleStudentSubmitDeliverable = async (e) => {
    e.preventDefault();
    if (!studentSubmitMilestone || !deliverableUrl) {
      toast('Please enter a deliverable URL', 'error');
      return;
    }
    setIsSubmittingDeliverable(true);
    try {
      const res = await fetch('/api/milestones/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id,
          action: 'SUBMIT',
          submissionData: { milestoneId: studentSubmitMilestone.id, deliverableUrl },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');

      toast('Deliverable submitted successfully!', 'success');
      const updatedMilestones = project.milestones.map((m) =>
        m.id === studentSubmitMilestone.id ? { ...m, status: 'SUBMITTED', deliverableUrl } : m
      );
      setProject((prev) => ({ ...prev, milestones: updatedMilestones }));
      setAllProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, milestones: updatedMilestones } : p))
      );
      setStudentSubmitMilestone(null);
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setIsSubmittingDeliverable(false);
    }
  };

  // Supervisor: Record Meeting Action (Dedicated in-place functionality)
  const handleSupervisorRecordMeeting = async (e) => {
    e.preventDefault();
    if (!meetingModalProject) return;
    if (!discussionPoints || !actionItems) {
      toast('Please fill in discussion points and action items', 'error');
      return;
    }
    setIsRecordingMeeting(true);
    try {
      const res = await fetch('/api/meetings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: meetingModalProject.id,
          meetingDate,
          discussionPoints,
          actionItems,
          satisfactionRating,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to record meeting');

      toast('Meeting minutes recorded successfully!', 'success');
      const appendLog = (logs) => [data.log, ...(logs || [])];

      setProject((prev) =>
        prev.id === meetingModalProject.id ? { ...prev, supervisorLogs: appendLog(prev.supervisorLogs) } : prev
      );
      setAllProjects((prev) =>
        prev.map((p) => (p.id === meetingModalProject.id ? { ...p, supervisorLogs: appendLog(p.supervisorLogs) } : p))
      );
      setMeetingModalProject(null);
      setDiscussionPoints('');
      setActionItems('');
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setIsRecordingMeeting(false);
    }
  };

  // Supervisor: Review Deliverable Action (Dedicated in-place functionality)
  const handleSupervisorReviewMilestone = async (milestoneId, status) => {
    if (!reviewModalProject) return;
    setIsReviewingMilestone(true);
    try {
      const res = await fetch('/api/milestones/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: reviewModalProject.id,
          action: 'REVIEW',
          reviewData: { milestoneId, status, feedback: supervisorFeedback || 'Approved by supervisor.' },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Review failed');

      toast(`Milestone ${status === 'APPROVED' ? 'approved' : 'revision requested'}!`, 'success');
      const updateMilestones = (milestones) =>
        milestones?.map((m) =>
          m.id === milestoneId ? { ...m, status, feedback: supervisorFeedback || 'Approved by supervisor.' } : m
        );

      setReviewModalProject((prev) => (prev ? { ...prev, milestones: updateMilestones(prev.milestones) } : null));
      setProject((prev) =>
        prev.id === reviewModalProject.id ? { ...prev, milestones: updateMilestones(prev.milestones) } : prev
      );
      setAllProjects((prev) =>
        prev.map((p) => (p.id === reviewModalProject.id ? { ...p, milestones: updateMilestones(p.milestones) } : p))
      );
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setIsReviewingMilestone(false);
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
      // Update project status AND all applications statuses in one go
      const updateProject = (p) => {
        if (p.id !== pId) return p;
        return {
          ...p,
          status: 'ALLOCATED',
          applications: p.applications.map((a) => ({
            ...a,
            status: a.id === appId ? 'ACCEPTED' : 'REJECTED',
          })),
        };
      };
      setProject((prev) => updateProject(prev));
      setAllProjects((prev) => prev.map(updateProject));
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setIsAllocatingTeam(false);
    }
  };

  // Admin: Reject a single application without allocating
  const handleRejectApplication = async (pId, appId) => {
    setIsRejectingApp(true);
    try {
      const res = await fetch('/api/projects/reject-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId: appId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Rejection failed');

      toast('Application rejected.', 'success');
      const updateProject = (p) => {
        if (p.id !== pId) return p;
        return {
          ...p,
          applications: p.applications.map((a) =>
            a.id === appId ? { ...a, status: 'REJECTED' } : a
          ),
        };
      };
      setProject((prev) => updateProject(prev));
      setAllProjects((prev) => prev.map(updateProject));
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setIsRejectingApp(false);
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
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
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

            {/* Active Project Switcher */}
            {allProjects.length > 1 && (
              <div className="flex items-center gap-1.5 ml-2">
                <span className="text-xs text-gray-500 font-medium">Viewing Project:</span>
                <select
                  value={project.id}
                  onChange={(e) => handleSelectProject(e.target.value)}
                  className="h-7 px-2 rounded-md border border-gray-300 bg-white text-xs font-semibold text-gray-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                >
                  {allProjects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500">
            {user.department || 'Department of Computer Science & Engineering'} •{' '}
            {role === 'STUDENT' && 'Capstone Deliverables & Team Workspace'}
            {role === 'SUPERVISOR' && 'Project Supervision, Bi-Weekly Logs & Approvals'}
            {role === 'EXAMINER' && 'Rubric Assessment & Viva Grading'}
            {role === 'SPONSOR' && 'Industry Challenge Portfolio & IP Oversight'}
            {role === 'ADMIN' && 'Capstone Program Administration & Analytics'}
          </p>
        </div>

        {/* Dynamic Buttons */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {role === 'SPONSOR' && (
            <Button variant="primary" size="md" onClick={() => setShowCreateModal(true)}>
              <PlusCircle className="w-4 h-4 mr-1.5" /> Post Problem Statement
            </Button>
          )}

          <Link href={`/workspace/${project.id}`}>
            <Button variant="outline" size="md">
              <FolderGit2 className="w-4 h-4 mr-1.5" /> Open Full Workspace
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
                <h4 className="mt-1 text-2xl font-bold text-gray-900">{project.similarityScore || 12.0}%</h4>
                <p className="mt-2 text-xs text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Similarity Verified (&lt;15%)
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-none border-gray-200">
              <CardContent className="pt-5">
                <p className="text-xs font-medium text-gray-500">Supervisor Meeting</p>
                <h4 className="mt-1 text-base font-bold text-gray-900">
                  {project.supervisorLogs?.length || 0} Recorded
                </h4>
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
                    <CardDescription>Directly submit URLs and review feedback</CardDescription>
                  </div>
                  {project.milestones && project.milestones.length > 0 && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        const firstPending = project.milestones.find((m) => m.status !== 'APPROVED') || project.milestones[0];
                        setStudentSubmitMilestone(firstPending);
                        if (firstPending.deliverableUrl) setDeliverableUrl(firstPending.deliverableUrl);
                      }}
                    >
                      <Upload className="w-3.5 h-3.5 mr-1.5" /> Submit Deliverable
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="space-y-3">
                  {project.milestones && project.milestones.length > 0 ? (
                    project.milestones.map((m, idx) => (
                      <div key={m.id} className="p-3.5 rounded-lg border border-gray-200 bg-gray-50/50 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-900 text-sm">
                            {idx + 1}. {m.title}
                          </span>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                m.status === 'APPROVED'
                                  ? 'success'
                                  : m.status === 'SUBMITTED'
                                  ? 'info'
                                  : m.status === 'REVISION_REQUESTED'
                                  ? 'danger'
                                  : 'warning'
                              }
                            >
                              {m.status.replace(/_/g, ' ')}
                            </Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setStudentSubmitMilestone(m);
                                if (m.deliverableUrl) setDeliverableUrl(m.deliverableUrl);
                              }}
                            >
                              <Upload className="w-3 h-3 mr-1" />
                              {m.deliverableUrl ? 'Update' : 'Submit'}
                            </Button>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">{m.description}</p>
                        {m.deliverableUrl && (
                          <div className="pt-1 text-xs">
                            <span className="text-gray-400">Submitted: </span>
                            <a
                              href={m.deliverableUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:underline font-medium inline-flex items-center gap-1"
                            >
                              <ExternalLink className="w-3 h-3" /> {m.deliverableUrl}
                            </a>
                          </div>
                        )}
                        {m.feedback && (
                          <div className="text-xs text-indigo-700 bg-indigo-50 p-2.5 rounded border border-indigo-100">
                            <strong>Supervisor Feedback:</strong> {m.feedback}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400 py-3 text-center">No milestones configured for this project yet.</p>
                  )}
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
                <h4 className="mt-1 text-2xl font-bold text-gray-900">{project.supervisorLogs?.length || 0}</h4>
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
                <CardDescription>Click to record meeting minutes or review student deliverables directly</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {allProjects
                .filter((p) => p.supervisorId === user.id || p.supervisor?.id === user.id || p.supervisor?.email === user.email || allProjects.length === 1)
                .map((p) => (
                  <div key={p.id} className="p-4 rounded-lg border border-gray-200 bg-white space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-semibold text-gray-900">{p.title}</h4>
                        <Badge variant="success">{p.status}</Badge>
                      </div>
                      <span className="text-xs text-gray-500">
                        {p.milestones?.length || 0} Milestones • {p.supervisorLogs?.length || 0} Logs
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{p.problemStatement}</p>
                    <div className="border-t border-gray-100 pt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="text-gray-500">Allocated Team: {p.allocatedTeam?.name || 'Unassigned'}</span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => setMeetingModalProject(p)}
                        >
                          <PlusCircle className="w-3.5 h-3.5 mr-1" /> Record Meeting Minutes
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setReviewModalProject(p)}
                        >
                          <FileCheck2 className="w-3.5 h-3.5 mr-1" /> Review Submissions
                        </Button>
                        <Link href={`/workspace/${p.id}`}>
                          <Button variant="outline" size="sm">Workspace</Button>
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
                <CardDescription>Open the 6-criteria marksheet and enter viva scores for {project.title}</CardDescription>
              </div>
              <Link href={`/evaluation?projectId=${project.id}`}>
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
                <h4 className="mt-1 text-lg font-bold text-gray-900 truncate">{project.sponsor?.name || 'Steerpath Smart IoT'}</h4>
                <p className="mt-2 text-xs text-amber-600">Industry Partner</p>
              </CardContent>
            </Card>

            <Card className="shadow-none border-gray-200">
              <CardContent className="pt-5">
                <p className="text-xs font-medium text-gray-500">Active Challenge Statements</p>
                <h4 className="mt-1 text-2xl font-bold text-gray-900">{allProjects.length}</h4>
                <p className="mt-2 text-xs text-gray-500">Capstone Portfolio</p>
              </CardContent>
            </Card>

            <Card className="shadow-none border-gray-200">
              <CardContent className="pt-5">
                <p className="text-xs font-medium text-gray-500">NDA Governance</p>
                <h4 className="mt-1 text-base font-bold text-gray-900">{project.ipStatus || 'CONFIDENTIAL'}</h4>
                <p className="mt-2 text-xs text-emerald-600">IP Agreement Enforced</p>
              </CardContent>
            </Card>

            <Card className="shadow-none border-gray-200">
              <CardContent className="pt-5">
                <p className="text-xs font-medium text-gray-500">Allocated Cohort</p>
                <h4 className="mt-1 text-base font-bold text-gray-900 truncate leading-tight">{project.allocatedTeam?.name || 'Pending Allocation'}</h4>
                <p className="mt-2 text-xs text-indigo-600">Deliverables In Progress</p>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-none border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle>Sponsored Opportunity: {project.title}</CardTitle>
                <CardDescription>Milestone progress and intellectual property records</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => setInspectModalProject(project)}>
                <Eye className="w-3.5 h-3.5 mr-1" /> View Summary
              </Button>
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
                    <Button variant="outline" size="sm">Open Full Workspace</Button>
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
                <CardTitle>Project Approvals & Registry</CardTitle>
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
                      <p className="text-xs text-gray-500">Sponsor: {p.sponsor?.name || 'Faculty Proposed'}</p>
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
                      <Button size="sm" variant="outline" onClick={() => setInspectModalProject(p)}>
                        Inspect Details
                      </Button>
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

                              {/* Action row — only show buttons when not already rejected */}
                              {app.status !== 'REJECTED' && (
                                <div className="flex items-center gap-2 pt-1">
                                  {app.status === 'ACCEPTED' ? (
                                    // Already accepted — show confirmation badge + re-allocate option
                                    <div className="flex items-center gap-2 w-full">
                                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-md border border-emerald-200">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        Team Accepted & Allocated
                                      </span>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        isLoading={isAllocatingTeam}
                                        onClick={() => handleAllocateTeam(p.id, app.id)}
                                      >
                                        Re-Allocate
                                      </Button>
                                    </div>
                                  ) : (
                                    // Pending — show Accept & Reject
                                    <>
                                      <Button
                                        size="sm"
                                        variant="primary"
                                        isLoading={isAllocatingTeam}
                                        onClick={() => handleAllocateTeam(p.id, app.id)}
                                      >
                                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                                        Accept & Allocate
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="danger"
                                        isLoading={isRejectingApp}
                                        onClick={() => handleRejectApplication(p.id, app.id)}
                                      >
                                        <X className="w-3.5 h-3.5 mr-1" />
                                        Reject
                                      </Button>
                                    </>
                                  )}
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

      {/* ============================================================ */}
      {/* MODAL 1: Student Submit Deliverable                          */}
      {/* ============================================================ */}
      {studentSubmitMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-w-md w-full bg-white rounded-lg border border-gray-200 p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-900">Submit Milestone Deliverable</h3>
                <p className="text-xs text-gray-500 mt-0.5">{studentSubmitMilestone.title}</p>
              </div>
              <button
                onClick={() => setStudentSubmitMilestone(null)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleStudentSubmitDeliverable} className="space-y-3 text-xs">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deliverable URL (GitHub / Demo / Drive)
                </label>
                <Input
                  value={deliverableUrl}
                  onChange={(e) => setDeliverableUrl(e.target.value)}
                  placeholder="https://github.com/..."
                  required
                />
              </div>
              <p className="text-[11px] text-gray-500">
                Milestone weight: <strong>{studentSubmitMilestone.weightage}%</strong> • Due Date:{' '}
                {formatDate(studentSubmitMilestone.dueDate)}
              </p>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <Button variant="ghost" size="sm" type="button" onClick={() => setStudentSubmitMilestone(null)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" isLoading={isSubmittingDeliverable}>
                  <Upload className="w-3.5 h-3.5 mr-1" /> Submit Deliverable
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: Supervisor Record Meeting Minutes                   */}
      {/* ============================================================ */}
      {meetingModalProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 overflow-y-auto">
          <div className="max-w-lg w-full bg-white rounded-lg border border-gray-200 p-6 space-y-4 my-8 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-900">Record Meeting Minutes</h3>
                <p className="text-xs text-gray-500 mt-0.5">{meetingModalProject.title}</p>
              </div>
              <button
                onClick={() => setMeetingModalProject(null)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSupervisorRecordMeeting} className="space-y-3 text-xs">
              <Input
                label="Meeting Date"
                type="date"
                value={meetingDate}
                onChange={(e) => setMeetingDate(e.target.value)}
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discussion Points & Progress
                </label>
                <textarea
                  rows={3}
                  value={discussionPoints}
                  onChange={(e) => setDiscussionPoints(e.target.value)}
                  placeholder="Summarize key topics discussed with the student team..."
                  className="w-full rounded-md border border-gray-300 p-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Agreed Action Items
                </label>
                <textarea
                  rows={3}
                  value={actionItems}
                  onChange={(e) => setActionItems(e.target.value)}
                  placeholder="1. Action item 1&#10;2. Action item 2..."
                  className="w-full rounded-md border border-gray-300 p-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student Progress Rating (1-5)
                </label>
                <select
                  value={satisfactionRating}
                  onChange={(e) => setSatisfactionRating(Number(e.target.value))}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value={5}>5 Stars – Exemplary Progress</option>
                  <option value={4}>4 Stars – Good Progress</option>
                  <option value={3}>3 Stars – Satisfactory</option>
                  <option value={2}>2 Stars – Needs Improvement</option>
                  <option value={1}>1 Star – Critical Bottlenecks</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <Button variant="ghost" size="sm" type="button" onClick={() => setMeetingModalProject(null)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" isLoading={isRecordingMeeting}>
                  Save Meeting Minutes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 3: Supervisor Review Submissions                       */}
      {/* ============================================================ */}
      {reviewModalProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 overflow-y-auto">
          <div className="max-w-xl w-full bg-white rounded-lg border border-gray-200 p-6 space-y-4 my-8 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-900">Review Milestone Deliverables</h3>
                <p className="text-xs text-gray-500 mt-0.5">{reviewModalProject.title}</p>
              </div>
              <button
                onClick={() => setReviewModalProject(null)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {reviewModalProject.milestones && reviewModalProject.milestones.length > 0 ? (
                reviewModalProject.milestones.map((m, idx) => (
                  <div key={m.id} className="p-3.5 rounded-lg border border-gray-200 bg-gray-50/50 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900 text-sm">
                        {idx + 1}. {m.title}
                      </span>
                      <Badge
                        variant={
                          m.status === 'APPROVED'
                            ? 'success'
                            : m.status === 'SUBMITTED'
                            ? 'info'
                            : m.status === 'REVISION_REQUESTED'
                            ? 'danger'
                            : 'warning'
                        }
                      >
                        {m.status.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                    <p className="text-gray-500">{m.description}</p>
                    {m.deliverableUrl && (
                      <div className="pt-1">
                        <span className="text-gray-400">Submission Link: </span>
                        <a
                          href={m.deliverableUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:underline font-medium inline-flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" /> {m.deliverableUrl}
                        </a>
                      </div>
                    )}
                    <div className="pt-2 border-t border-gray-200 space-y-2">
                      <Input
                        placeholder="Supervisor evaluation feedback..."
                        defaultValue={m.feedback || supervisorFeedback}
                        onChange={(e) => setSupervisorFeedback(e.target.value)}
                        className="h-8 text-xs"
                      />
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="primary"
                          isLoading={isReviewingMilestone}
                          onClick={() => handleSupervisorReviewMilestone(m.id, 'APPROVED')}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          isLoading={isReviewingMilestone}
                          onClick={() => handleSupervisorReviewMilestone(m.id, 'REVISION_REQUESTED')}
                        >
                          Request Revision
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400 text-center py-4">No milestones found on this project.</p>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-gray-100">
              <Button variant="ghost" size="sm" onClick={() => setReviewModalProject(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 4: Admin / Sponsor Inspect Project Details            */}
      {/* ============================================================ */}
      {inspectModalProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 overflow-y-auto">
          <div className="max-w-xl w-full bg-white rounded-lg border border-gray-200 p-6 space-y-4 my-8 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-900">{inspectModalProject.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="purple">{inspectModalProject.category?.replace(/_/g, ' ')}</Badge>
                  <Badge variant="info">{inspectModalProject.status}</Badge>
                  <Badge variant="default">NDA: {inspectModalProject.ipStatus}</Badge>
                </div>
              </div>
              <button
                onClick={() => setInspectModalProject(null)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-gray-700">
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 space-y-1">
                <p className="font-semibold text-gray-900">Problem Statement:</p>
                <p className="text-gray-600 leading-relaxed">{inspectModalProject.problemStatement}</p>
              </div>

              {inspectModalProject.expectedOutcomes && (
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 space-y-1">
                  <p className="font-semibold text-gray-900">Expected Outcomes:</p>
                  <p className="text-gray-600">{inspectModalProject.expectedOutcomes}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 rounded border border-gray-200">
                  <span className="text-gray-400 block text-[11px]">Sponsor</span>
                  <span className="font-semibold text-gray-900">{inspectModalProject.sponsor?.name || 'Faculty Proposed'}</span>
                </div>
                <div className="p-2.5 rounded border border-gray-200">
                  <span className="text-gray-400 block text-[11px]">Faculty Supervisor</span>
                  <span className="font-semibold text-gray-900">{inspectModalProject.supervisor?.name || 'Assigned'}</span>
                </div>
              </div>

              <div className="p-2.5 rounded border border-gray-200">
                <span className="text-gray-400 block text-[11px]">Allocated Cohort</span>
                <span className="font-semibold text-gray-900">
                  {inspectModalProject.allocatedTeam?.name || 'Pending Allocation'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <Link href={`/workspace/${inspectModalProject.id}`}>
                <Button variant="outline" size="sm">
                  <FolderGit2 className="w-3.5 h-3.5 mr-1" /> Open Full Workspace
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => setInspectModalProject(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 5: Sponsor Post Problem Statement                      */}
      {/* ============================================================ */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 overflow-y-auto">
          <div className="max-w-xl w-full bg-white rounded-lg border border-gray-200 p-6 space-y-4 my-8 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-900">Post Problem Statement</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Define the challenge statement, technical constraints, and deliverable outcomes
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateProject} className="space-y-3 text-xs">
              <Input
                label="Project Title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
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
                  required
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
                  required
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
