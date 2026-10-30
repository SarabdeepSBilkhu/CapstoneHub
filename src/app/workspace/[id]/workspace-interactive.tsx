'use client';

import React, { useState } from 'react';
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
  Clock,
  ArrowRight,
  TrendingUp,
  Award,
  AlertCircle,
  FileCheck2,
  ExternalLink,
  Code,
  Building2,
  ShieldCheck,
  User,
  Users,
  Layers,
  FileText,
  Lock,
  PlusCircle,
  Upload,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';

interface Props {
  project: any;
  currentUser: any;
}

export function ProjectWorkspaceInteractive({ project: initialProject, currentUser }: Props) {
  const { toast } = useToast();
  const [project, setProject] = useState(initialProject);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'MILESTONES' | 'MEETINGS' | 'ORIGINALITY_IP' | 'EVALUATIONS'>('OVERVIEW');

  // Milestone submission modal / form state
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>('');
  const [deliverableUrl, setDeliverableUrl] = useState<string>('https://github.com/capstonehub-demo/smart-campus-navigation/releases/tag/v1.0.0');
  const [isSubmittingDeliverable, setIsSubmittingDeliverable] = useState(false);

  // Supervisor review state
  const [reviewMilestoneId, setReviewMilestoneId] = useState<string>('');
  const [supervisorFeedback, setSupervisorFeedback] = useState<string>('Approved. Vector pathfinding benchmarks verified against campus floorplans.');

  // Supervisor meeting form state
  const [meetingDate, setMeetingDate] = useState('2026-11-26');
  const [discussionPoints, setDiscussionPoints] = useState('Demonstrated working 2-floor navigation prototype to Elena Rostova. Verified Steerpath NDA requirements.');
  const [actionItems, setActionItems] = useState('1. Maya: Add NDA and IP disclosure document to repository.\n2. Alex: Conduct user trial with 15 freshman students.');
  const [satisfactionRating, setSatisfactionRating] = useState(5);
  const [isRecordingMeeting, setIsRecordingMeeting] = useState(false);

  const role = currentUser?.role || 'STUDENT';
  const totalMilestones = project.milestones?.length || 0;
  const approvedMilestones = project.milestones?.filter((m: any) => m.status === 'APPROVED').length || 0;
  const progressPercent = totalMilestones > 0 ? Math.round((approvedMilestones / totalMilestones) * 100) : 0;

  // Handle Deliverable Submission
  const handleSubmitDeliverable = async (mId: string) => {
    setIsSubmittingDeliverable(true);
    try {
      const res = await fetch('/api/milestones/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id,
          action: 'SUBMIT',
          submissionData: { milestoneId: mId, deliverableUrl },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');

      toast(data.message || 'Deliverable submitted!', 'success');
      setProject((prev: any) => ({
        ...prev,
        milestones: prev.milestones.map((m: any) => (m.id === mId ? { ...m, status: 'SUBMITTED', deliverableUrl } : m)),
      }));
      setSelectedMilestoneId('');
    } catch (err: any) {
      toast(err.message, 'error');
    } finally {
      setIsSubmittingDeliverable(false);
    }
  };

  // Handle Supervisor Review
  const handleReviewDeliverable = async (mId: string, status: 'APPROVED' | 'REVISION_REQUESTED') => {
    try {
      const res = await fetch('/api/milestones/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id,
          action: 'REVIEW',
          reviewData: { milestoneId: mId, status, feedback: supervisorFeedback },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Review failed');

      toast(data.message || 'Milestone reviewed!', 'success');
      setProject((prev: any) => ({
        ...prev,
        milestones: prev.milestones.map((m: any) =>
          m.id === mId ? { ...m, status, feedback: supervisorFeedback } : m
        ),
      }));
      setReviewMilestoneId('');
    } catch (err: any) {
      toast(err.message, 'error');
    }
  };

  // Handle Supervisor Meeting Log Recording
  const handleRecordMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRecordingMeeting(true);
    try {
      const res = await fetch('/api/meetings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id,
          meetingDate,
          discussionPoints,
          actionItems,
          satisfactionRating,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Log failed');

      toast(data.message || 'Meeting recorded!', 'success');
      setProject((prev: any) => ({
        ...prev,
        supervisorLogs: [data.log, ...(prev.supervisorLogs || [])],
      }));
      setDiscussionPoints('');
      setActionItems('');
    } catch (err: any) {
      toast(err.message, 'error');
    } finally {
      setIsRecordingMeeting(false);
    }
  };

  // Derive Multi-Examiner Radar Scores
  const evaluations = project.evaluations || [];
  const submittedEvals = evaluations.filter((e: any) => e.isSubmitted);
  const avgTotalScore =
    submittedEvals.length > 0
      ? (
          submittedEvals.reduce((acc: number, curr: any) => acc + curr.totalScore, 0) /
          submittedEvals.length
        ).toFixed(1)
      : 'N/A';

  const avgCriteria = [
    {
      subject: 'Tech Impl (25)',
      score:
        submittedEvals.length > 0
          ? Number(
              (
                submittedEvals.reduce((acc: number, c: any) => acc + c.technicalImplementationScore, 0) /
                submittedEvals.length
              ).toFixed(1)
            )
          : 0,
      fullMark: 25,
    },
    {
      subject: 'Problem (15)',
      score:
        submittedEvals.length > 0
          ? Number(
              (
                submittedEvals.reduce((acc: number, c: any) => acc + c.problemUnderstandingScore, 0) /
                submittedEvals.length
              ).toFixed(1)
            )
          : 0,
      fullMark: 15,
    },
    {
      subject: 'Innovation (15)',
      score:
        submittedEvals.length > 0
          ? Number(
              (
                submittedEvals.reduce((acc: number, c: any) => acc + c.innovationScore, 0) /
                submittedEvals.length
              ).toFixed(1)
            )
          : 0,
      fullMark: 15,
    },
    {
      subject: 'Documentation (15)',
      score:
        submittedEvals.length > 0
          ? Number(
              (
                submittedEvals.reduce((acc: number, c: any) => acc + c.documentationScore, 0) /
                submittedEvals.length
              ).toFixed(1)
            )
          : 0,
      fullMark: 15,
    },
    {
      subject: 'Presentation (15)',
      score:
        submittedEvals.length > 0
          ? Number(
              (
                submittedEvals.reduce((acc: number, c: any) => acc + c.presentationScore, 0) /
                submittedEvals.length
              ).toFixed(1)
            )
          : 0,
      fullMark: 15,
    },
    {
      subject: 'Outcome (15)',
      score:
        submittedEvals.length > 0
          ? Number(
              (
                submittedEvals.reduce((acc: number, c: any) => acc + c.projectOutcomeScore, 0) /
                submittedEvals.length
              ).toFixed(1)
            )
          : 0,
      fullMark: 15,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Project Title Banner & Status Badges */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="warning">{project.category.replace('_', ' ')}</Badge>
            <Badge variant={project.status === 'COMPLETED' ? 'success' : 'purple'}>
              {project.status.replace('_', ' ')}
            </Badge>
            <Badge variant="purple">NDA: {project.ipStatus}</Badge>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">{project.title}</h1>
          <p className="text-xs text-zinc-400">
            Sponsored by <strong className="text-zinc-200">{project.sponsor?.name || 'Elena Rostova (Steerpath)'}</strong> •
            Supervised by <strong className="text-zinc-200">{project.supervisor?.name || 'Dr. Robert Martinez'}</strong>
          </p>
        </div>

        {/* Action Link to Public Showcase or Repository */}
        <div className="flex items-center gap-3">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-200 transition-colors"
            >
              <Code className="w-4 h-4" /> Source Code
            </a>
          )}
          {project.isPublicShowcase && (
            <a
              href="/showcase"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800/60 text-xs font-semibold text-emerald-300 transition-colors"
            >
              <ExternalLink className="w-4 h-4" /> View in Public Showcase
            </a>
          )}
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-indigo-900/30 bg-indigo-950/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-zinc-400">Milestone Progress</p>
                <h4 className="mt-1 text-2xl font-bold text-white">{progressPercent}%</h4>
              </div>
              <div className="p-2.5 rounded-lg bg-indigo-600/20 text-indigo-400">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
            </div>
            <p className="mt-2 text-[11px] text-zinc-400">{approvedMilestones} of {totalMilestones} Milestones Approved</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-zinc-400">Multi-Examiner Avg</p>
                <h4 className="mt-1 text-2xl font-bold text-white">
                  {avgTotalScore} <span className="text-xs font-normal text-zinc-400">/ 100</span>
                </h4>
              </div>
              <div className="p-2.5 rounded-lg bg-purple-600/20 text-purple-400">
                <Award className="w-5 h-5" />
              </div>
            </div>
            <p className="mt-3 text-xs text-purple-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> 3 Independent Evaluators
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-zinc-400">Originality Report</p>
                <h4 className="mt-1 text-2xl font-bold text-white">{project.similarityScore || 12.0}%</h4>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-600/20 text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <p className="mt-3 text-xs text-emerald-400">Similarity Verified (Under 15% threshold)</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-zinc-400">Allocated Team</p>
                <h4 className="mt-1 text-base font-bold text-white truncate">
                  {project.allocatedTeam?.name || 'GeoPath Innovators'}
                </h4>
              </div>
              <div className="p-2.5 rounded-lg bg-sky-600/20 text-sky-400">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <p className="mt-3 text-xs text-sky-400">2 Active Undergraduate Engineers</p>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs (Step 5 Project Workspace) */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-2 overflow-x-auto text-xs font-semibold">
        {(
          [
            { id: 'OVERVIEW', label: '1. Project Overview & Timeline' },
            { id: 'MILESTONES', label: '2. Milestones & Deliverables' },
            { id: 'MEETINGS', label: '3. Supervisor Meeting Logs' },
            { id: 'EVALUATIONS', label: '4. Multi-Examiner Rubrics' },
            { id: 'ORIGINALITY_IP', label: '5. Originality & IP Governance' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-zinc-800 text-white font-bold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ============================================================ */}
      {/* TAB 1: OVERVIEW & TIMELINE                                    */}
      {/* ============================================================ */}
      {activeTab === 'OVERVIEW' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Case Study & Engineering Problem Statement</CardTitle>
                <CardDescription>Industry challenge originated from Steerpath smart campus wayfinding</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs text-zinc-300 leading-relaxed">
                <p>{project.problemStatement}</p>
                {project.objectives && (
                  <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800">
                    <p className="font-semibold text-white mb-1">Key Project Objectives:</p>
                    <p className="whitespace-pre-line text-zinc-400">{project.objectives}</p>
                  </div>
                )}
                {project.expectedOutcomes && (
                  <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800">
                    <p className="font-semibold text-white mb-1">Expected Deliverable Outcomes:</p>
                    <p className="text-zinc-400">{project.expectedOutcomes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Required Technologies & Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Required Technology Stack</CardTitle>
                <CardDescription>Frameworks, languages, and spatial libraries used</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.requiredSkills?.map((skill: string) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-md bg-indigo-950/40 border border-indigo-900/60 text-xs font-semibold text-indigo-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Stakeholders */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Stakeholders</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-950/60 border border-zinc-800">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{project.sponsor?.name || 'Elena Rostova'}</p>
                    <p className="text-[11px] text-zinc-400">Industry Sponsor (Steerpath)</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-950/60 border border-zinc-800">
                  <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{project.supervisor?.name || 'Dr. Robert Martinez'}</p>
                    <p className="text-[11px] text-zinc-400">Faculty Supervisor</p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800 space-y-2">
                  <p className="font-semibold text-white">Allocated Engineering Cohort</p>
                  <p className="text-zinc-400 font-medium">{project.allocatedTeam?.name || 'GeoPath Innovators'}</p>
                  <div className="pt-2 divide-y divide-zinc-800/80">
                    <div className="py-1 flex justify-between">
                      <span className="text-zinc-300">Alex Chen</span>
                      <Badge variant="purple">Team Lead</Badge>
                    </div>
                    <div className="py-1 flex justify-between">
                      <span className="text-zinc-300">Maya Patel</span>
                      <span className="text-zinc-500">Core Developer</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: MILESTONES & DELIVERABLES (Step 6)                      */}
      {/* ============================================================ */}
      {activeTab === 'MILESTONES' && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Milestones & Deliverable Roadmap</CardTitle>
                <CardDescription>
                  Strict weighted stages with supervisor review and revision workflows
                </CardDescription>
              </div>
              <Badge variant="success">All 5 Stages Configured</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.milestones?.map((m: any, idx: number) => (
                  <div
                    key={m.id}
                    className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-800 text-xs font-bold text-zinc-300">
                          {idx + 1}
                        </span>
                        <h4 className="font-semibold text-white text-sm">{m.title}</h4>
                      </div>
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
                          {m.status.replace('_', ' ')}
                        </Badge>
                        <span className="text-xs text-zinc-400 font-semibold">{m.weightage}% Weight</span>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-400 pl-8">{m.description}</p>

                    <div className="flex flex-wrap items-center justify-between gap-3 pl-8 pt-2 border-t border-zinc-800/80 text-xs">
                      <span className="flex items-center gap-1.5 text-zinc-500">
                        <Calendar className="w-3.5 h-3.5" /> Due: {formatDate(m.dueDate)}
                      </span>

                      {/* Deliverable Link if available */}
                      {m.deliverableUrl && (
                        <a
                          href={m.deliverableUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-medium"
                        >
                          <ExternalLink className="w-3 h-3" /> Submitted Link
                        </a>
                      )}

                      {/* Student Action: Submit or Resubmit */}
                      {role === 'STUDENT' && (
                        <div>
                          {selectedMilestoneId === m.id ? (
                            <div className="flex items-center gap-2">
                              <Input
                                placeholder="https://github.com/..."
                                value={deliverableUrl}
                                onChange={(e) => setDeliverableUrl(e.target.value)}
                                className="h-8 text-xs w-64"
                              />
                              <Button
                                size="sm"
                                isLoading={isSubmittingDeliverable}
                                onClick={() => handleSubmitDeliverable(m.id)}
                              >
                                Send
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setSelectedMilestoneId('')}
                              >
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedMilestoneId(m.id);
                                if (m.deliverableUrl) setDeliverableUrl(m.deliverableUrl);
                              }}
                            >
                              <Upload className="w-3.5 h-3.5 mr-1" />
                              {m.deliverableUrl ? 'Update Deliverable' : 'Submit Deliverable'}
                            </Button>
                          )}
                        </div>
                      )}

                      {/* Supervisor Action: Review / Approve / Request Revision */}
                      {(role === 'SUPERVISOR' || role === 'ADMIN') && (
                        <div>
                          {reviewMilestoneId === m.id ? (
                            <div className="flex flex-col gap-2 p-2 rounded-lg bg-zinc-900 border border-zinc-700">
                              <Input
                                placeholder="Enter supervisor feedback..."
                                value={supervisorFeedback}
                                onChange={(e) => setSupervisorFeedback(e.target.value)}
                                className="h-8 text-xs w-80"
                              />
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="primary"
                                  onClick={() => handleReviewDeliverable(m.id, 'APPROVED')}
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="danger"
                                  onClick={() => handleReviewDeliverable(m.id, 'REVISION_REQUESTED')}
                                >
                                  Request Revision
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setReviewMilestoneId('')}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => {
                                setReviewMilestoneId(m.id);
                                if (m.feedback) setSupervisorFeedback(m.feedback);
                              }}
                            >
                              <FileCheck2 className="w-3.5 h-3.5 mr-1" /> Review Deliverable
                            </Button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Supervisor Feedback Callout */}
                    {m.feedback && (
                      <div className="ml-8 text-xs text-indigo-300 bg-indigo-950/40 p-2.5 rounded-lg border border-indigo-900/60">
                        <strong className="text-white">Supervisor Feedback:</strong> {m.feedback}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 3: SUPERVISOR MEETING LOGS (Step 7)                       */}
      {/* ============================================================ */}
      {activeTab === 'MEETINGS' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recorded Supervisor Meeting Logs</CardTitle>
                <CardDescription>
                  Directly addresses invisible supervision by recording attendees, decisions, and action items
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {project.supervisorLogs?.map((log: any) => (
                  <div key={log.id} className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white">
                        Meeting Date: {formatDate(log.meetingDate)}
                      </span>
                      <span className="text-amber-400 font-medium">
                        Rating: {'★'.repeat(log.satisfactionRating || 5)}
                      </span>
                    </div>

                    <div className="text-xs text-zinc-400">
                      <strong>Attendees:</strong> {log.attendees}
                    </div>

                    <div className="text-xs text-zinc-300 bg-zinc-900/40 p-3 rounded-lg border border-zinc-800 space-y-1">
                      <p className="font-semibold text-white">Discussion & Problems Identified:</p>
                      <p>{log.discussionPoints}</p>
                      {log.problemsIdentified && (
                        <p className="text-rose-300 mt-1">
                          <strong>Problem:</strong> {log.problemsIdentified}
                        </p>
                      )}
                      {log.decisions && (
                        <p className="text-emerald-300 mt-1">
                          <strong>Decision:</strong> {log.decisions}
                        </p>
                      )}
                    </div>

                    <div className="text-xs text-indigo-300 bg-indigo-950/30 p-3 rounded-lg border border-indigo-900/40 space-y-1">
                      <p className="font-semibold text-indigo-200">Agreed Action Items:</p>
                      <p className="whitespace-pre-line">{log.actionItems}</p>
                    </div>

                    {log.nextMeetingDate && (
                      <p className="text-[11px] text-zinc-500">
                        Next Scheduled Sync: {formatDate(log.nextMeetingDate)}
                      </p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Supervisor New Log Form */}
          <div className="space-y-6">
            {(role === 'SUPERVISOR' || role === 'ADMIN') ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-1.5">
                    <PlusCircle className="w-4 h-4 text-sky-400" /> Record Bi-Weekly Meeting
                  </CardTitle>
                  <CardDescription>Log minutes and assign student action items</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRecordMeeting} className="space-y-3 text-xs">
                    <Input
                      label="Meeting Date"
                      type="date"
                      value={meetingDate}
                      onChange={(e) => setMeetingDate(e.target.value)}
                    />
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-300 uppercase mb-1">
                        Discussion Points
                      </label>
                      <textarea
                        rows={3}
                        value={discussionPoints}
                        onChange={(e) => setDiscussionPoints(e.target.value)}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-950 p-2.5 text-zinc-200"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-300 uppercase mb-1">
                        Agreed Action Items
                      </label>
                      <textarea
                        rows={3}
                        value={actionItems}
                        onChange={(e) => setActionItems(e.target.value)}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-950 p-2.5 text-zinc-200"
                      />
                    </div>
                    <Button type="submit" size="sm" className="w-full mt-2" isLoading={isRecordingMeeting}>
                      Save Meeting Log & Sync
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-indigo-900/40 bg-indigo-950/20">
                <CardHeader>
                  <CardTitle className="text-base text-indigo-300">Continuous Supervision</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-zinc-400 leading-relaxed">
                  Your supervisor Dr. Robert Martinez conducts regular audits. All assigned action items
                  recorded during check-ins appear automatically here.
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 4: MULTI-EXAMINER RUBRICS (Step 8)                        */}
      {/* ============================================================ */}
      {activeTab === 'EVALUATIONS' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Independent Multi-Examiner Assessment</CardTitle>
                  <CardDescription>
                    Final grade unlocked when all 3 independent faculty evaluations are submitted
                  </CardDescription>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-emerald-400">{avgTotalScore}</span>
                  <span className="text-xs text-zinc-400"> / 100</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {project.evaluations?.map((ev: any, idx: number) => (
                  <div key={ev.id} className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-white text-sm">
                          Examiner {idx + 1}: {ev.examinerName}
                        </h4>
                        <p className="text-[11px] text-zinc-400">{ev.examinerDepartment}</p>
                      </div>
                      <Badge variant={ev.isSubmitted ? 'success' : 'warning'}>
                        {ev.isSubmitted ? `${ev.totalScore} / 100` : 'Pending'}
                      </Badge>
                    </div>

                    {ev.isSubmitted && (
                      <>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs">
                          <div className="p-2 rounded bg-zinc-900">
                            <p className="text-[10px] text-zinc-400">Tech (25)</p>
                            <p className="font-bold text-white">{ev.technicalImplementationScore}</p>
                          </div>
                          <div className="p-2 rounded bg-zinc-900">
                            <p className="text-[10px] text-zinc-400">Problem (15)</p>
                            <p className="font-bold text-white">{ev.problemUnderstandingScore}</p>
                          </div>
                          <div className="p-2 rounded bg-zinc-900">
                            <p className="text-[10px] text-zinc-400">Innov (15)</p>
                            <p className="font-bold text-white">{ev.innovationScore}</p>
                          </div>
                          <div className="p-2 rounded bg-zinc-900">
                            <p className="text-[10px] text-zinc-400">Doc (15)</p>
                            <p className="font-bold text-white">{ev.documentationScore}</p>
                          </div>
                          <div className="p-2 rounded bg-zinc-900">
                            <p className="text-[10px] text-zinc-400">Pres (15)</p>
                            <p className="font-bold text-white">{ev.presentationScore}</p>
                          </div>
                          <div className="p-2 rounded bg-zinc-900">
                            <p className="text-[10px] text-zinc-400">Outcome (15)</p>
                            <p className="font-bold text-white">{ev.projectOutcomeScore}</p>
                          </div>
                        </div>

                        <div className="text-xs text-zinc-300 bg-zinc-900/40 p-2.5 rounded-lg border border-zinc-800">
                          <strong>Viva Remarks:</strong> {ev.comments}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Recharts Radar Visualizer */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Rubric Assessment Radar</CardTitle>
                <CardDescription className="text-xs">Aggregated across all 3 independent examiners</CardDescription>
              </CardHeader>
              <CardContent className="h-[270px] w-full pt-0 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={avgCriteria}>
                    <PolarGrid stroke="#3f3f46" />
                    <PolarAngleAxis dataKey="subject" stroke="#a1a1aa" tick={{ fontSize: 9 }} />
                    <PolarRadiusAxis stroke="#52525b" tick={{ fontSize: 8 }} />
                    <Radar
                      name="Score"
                      dataKey="score"
                      stroke="#818cf8"
                      fill="#818cf8"
                      fillOpacity={0.45}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 5: ORIGINALITY & IP GOVERNANCE (Step 9)                   */}
      {/* ============================================================ */}
      {activeTab === 'ORIGINALITY_IP' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                Originality & Similarity Verification
              </CardTitle>
              <CardDescription>Academic integrity compliance record</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Document Evaluated:</span>
                  <span className="font-semibold text-white">Final Project Report & Source Code</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Similarity Index:</span>
                  <Badge variant="success">12.0% (Checked 18 December)</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Verification Status:</span>
                  <span className="font-semibold text-emerald-400">Recorded & Approved by Committee</span>
                </div>
                <div className="pt-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> View Official Originality Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-900/40 bg-amber-950/10">
            <CardHeader>
              <CardTitle className="text-amber-300 flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Intellectual Property & Sponsor Governance
              </CardTitle>
              <CardDescription>Steerpath corporate agreements and publication rights</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-2">
                <div className="flex justify-between py-1 border-b border-zinc-800">
                  <span className="text-zinc-400">Ownership:</span>
                  <span className="font-medium text-white">Joint Academic / Steerpath Sponsor Owned</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-800">
                  <span className="text-zinc-400">Confidentiality:</span>
                  <Badge variant="warning">CONFIDENTIAL (NDA Active)</Badge>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-800">
                  <span className="text-zinc-400">Public Publication Permission:</span>
                  <span className="font-medium text-emerald-400">Granted with proprietary coordinates redacted</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-zinc-400">Agreement Documents:</span>
                  <span className="font-medium text-white">Steerpath_NDA_Signed_2026.pdf</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

