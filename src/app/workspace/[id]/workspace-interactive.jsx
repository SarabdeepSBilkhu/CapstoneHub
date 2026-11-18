'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/context/toast-context';
import { formatDate } from '@/lib/utils';
import {
  Award,
  Calendar,
  CheckCircle2,
  TrendingUp,
  FileCheck2,
  ExternalLink,
  Code,
  Building2,
  ShieldCheck,
  Users,
  FileText,
  Lock,
  PlusCircle,
  Upload,
} from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';

export function ProjectWorkspaceInteractive({ project: initialProject, currentUser }) {
  const { toast } = useToast();
  const [project, setProject] = useState(initialProject);
  const [activeTab, setActiveTab] = useState('OVERVIEW');

  // Milestone submission modal / form state
  const [selectedMilestoneId, setSelectedMilestoneId] = useState('');
  const [deliverableUrl, setDeliverableUrl] = useState('https://github.com/capstonehub-demo/smart-campus-navigation/releases/tag/v1.0.0');
  const [isSubmittingDeliverable, setIsSubmittingDeliverable] = useState(false);

  // Supervisor review state
  const [reviewMilestoneId, setReviewMilestoneId] = useState('');
  const [supervisorFeedback, setSupervisorFeedback] = useState('Approved. Vector pathfinding benchmarks verified against campus floorplans.');

  // Supervisor meeting form state
  const [meetingDate, setMeetingDate] = useState('2026-11-26');
  const [discussionPoints, setDiscussionPoints] = useState('Demonstrated working 2-floor navigation prototype to Elena Rostova. Verified Steerpath NDA requirements.');
  const [actionItems, setActionItems] = useState('1. Maya: Add NDA and IP disclosure document to repository.\n2. Alex: Conduct user trial with 15 freshman students.');
  const [satisfactionRating, setSatisfactionRating] = useState(5);
  const [isRecordingMeeting, setIsRecordingMeeting] = useState(false);

  const role = currentUser?.role || 'STUDENT';
  const totalMilestones = project.milestones?.length || 0;
  const approvedMilestones = project.milestones?.filter((m) => m.status === 'APPROVED').length || 0;
  const progressPercent = totalMilestones > 0 ? Math.round((approvedMilestones / totalMilestones) * 100) : 0;

  // Handle Deliverable Submission
  const handleSubmitDeliverable = async (mId) => {
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
      setProject((prev) => ({
        ...prev,
        milestones: prev.milestones.map((m) => (m.id === mId ? { ...m, status: 'SUBMITTED', deliverableUrl } : m)),
      }));
      setSelectedMilestoneId('');
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setIsSubmittingDeliverable(false);
    }
  };

  // Handle Supervisor Review
  const handleReviewDeliverable = async (mId, status) => {
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
      setProject((prev) => ({
        ...prev,
        milestones: prev.milestones.map((m) =>
          m.id === mId ? { ...m, status, feedback: supervisorFeedback } : m
        ),
      }));
      setReviewMilestoneId('');
    } catch (err) {
      toast(err.message, 'error');
    }
  };

  // Handle Supervisor Meeting Log Recording
  const handleRecordMeeting = async (e) => {
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
      setProject((prev) => ({
        ...prev,
        supervisorLogs: [data.log, ...(prev.supervisorLogs || [])],
      }));
      setDiscussionPoints('');
      setActionItems('');
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setIsRecordingMeeting(false);
    }
  };

  const evaluations = project.evaluations || [];
  const submittedEvals = evaluations.filter((e) => e.isSubmitted);
  const avgTotalScore =
    submittedEvals.length > 0
      ? (
          submittedEvals.reduce((acc, curr) => acc + curr.totalScore, 0) /
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
                submittedEvals.reduce((acc, c) => acc + c.technicalImplementationScore, 0) /
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
                submittedEvals.reduce((acc, c) => acc + c.problemUnderstandingScore, 0) /
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
                submittedEvals.reduce((acc, c) => acc + c.innovationScore, 0) /
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
                submittedEvals.reduce((acc, c) => acc + c.documentationScore, 0) /
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
                submittedEvals.reduce((acc, c) => acc + c.presentationScore, 0) /
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
                submittedEvals.reduce((acc, c) => acc + c.projectOutcomeScore, 0) /
                submittedEvals.length
              ).toFixed(1)
            )
          : 0,
      fullMark: 15,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title & Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Badge variant="warning">{project.category.replace(/_/g, ' ')}</Badge>
            <Badge variant={project.status === 'COMPLETED' ? 'success' : 'purple'}>
              {project.status.replace(/_/g, ' ')}
            </Badge>
            <Badge variant="default">NDA: {project.ipStatus}</Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">{project.title}</h1>
          <p className="text-xs text-gray-500">
            Sponsored by <strong className="text-gray-800">{project.sponsor?.name || 'Elena Rostova (Steerpath)'}</strong> •{' '}
            Supervised by <strong className="text-gray-800">{project.supervisor?.name || 'Dr. Robert Martinez'}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-gray-200 hover:bg-gray-50 text-xs font-medium text-gray-700 transition-colors"
            >
              <Code className="w-3.5 h-3.5" /> Source
            </a>
          )}
          {project.isPublicShowcase && (
            <a
              href="/showcase"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-700 hover:bg-emerald-100 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Public Showcase
            </a>
          )}
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-none border-gray-200">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">Milestone Progress</p>
                <h4 className="mt-1 text-2xl font-bold text-gray-900">{progressPercent}%</h4>
              </div>
              <div className="p-2 rounded-md bg-indigo-50 text-indigo-600">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${progressPercent}%` }} />
            </div>
            <p className="mt-2 text-[11px] text-gray-500">{approvedMilestones} of {totalMilestones} Approved</p>
          </CardContent>
        </Card>

        <Card className="shadow-none border-gray-200">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs font-medium text-gray-500">Examiner Avg</p>
                <h4 className="mt-1 text-2xl font-bold text-gray-900">
                  {avgTotalScore} <span className="text-xs font-normal text-gray-400">/ 100</span>
                </h4>
              </div>
              <div className="p-2 rounded-md bg-purple-50 text-purple-600">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <p className="mt-3 text-xs text-purple-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 3 Evaluators
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-none border-gray-200">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs font-medium text-gray-500">Originality Report</p>
                <h4 className="mt-1 text-2xl font-bold text-gray-900">{project.similarityScore || 12.0}%</h4>
              </div>
              <div className="p-2 rounded-md bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <p className="mt-3 text-xs text-emerald-600">Similarity Verified (&lt;15%)</p>
          </CardContent>
        </Card>

        <Card className="shadow-none border-gray-200">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs font-medium text-gray-500">Allocated Team</p>
                <h4 className="mt-1 text-base font-bold text-gray-900 truncate">
                  {project.allocatedTeam?.name || 'GeoPath Innovators'}
                </h4>
              </div>
              <div className="p-2 rounded-md bg-blue-50 text-blue-600">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <p className="mt-3 text-xs text-blue-600">2 Active Members</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-200 pb-2 overflow-x-auto text-xs font-medium">
        {[
          { id: 'OVERVIEW', label: '1. Overview' },
          { id: 'MILESTONES', label: '2. Milestones' },
          { id: 'MEETINGS', label: '3. Meeting Logs' },
          { id: 'EVALUATIONS', label: '4. Rubrics' },
          { id: 'ORIGINALITY_IP', label: '5. Originality & IP' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-gray-900 text-white font-medium'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'OVERVIEW' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-none border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle>Problem Statement</CardTitle>
                <CardDescription>Industry challenge from Steerpath smart campus wayfinding</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-xs text-gray-700 leading-relaxed">
                <p>{project.problemStatement}</p>
                {project.objectives && (
                  <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <p className="font-semibold text-gray-900 mb-1">Key Objectives:</p>
                    <p className="whitespace-pre-line text-gray-600">{project.objectives}</p>
                  </div>
                )}
                {project.expectedOutcomes && (
                  <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <p className="font-semibold text-gray-900 mb-1">Expected Deliverables:</p>
                    <p className="text-gray-600">{project.expectedOutcomes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-none border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle>Technology Stack</CardTitle>
                <CardDescription>Frameworks, languages, and libraries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {project.requiredSkills?.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded bg-indigo-50 border border-indigo-100 text-xs font-medium text-indigo-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="shadow-none border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle>Stakeholders</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50">
                  <div className="p-2 rounded bg-amber-100 text-amber-700">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{project.sponsor?.name || 'Elena Rostova'}</p>
                    <p className="text-[11px] text-gray-500">Industry Sponsor (Steerpath)</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50">
                  <div className="p-2 rounded bg-blue-100 text-blue-700">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{project.supervisor?.name || 'Dr. Robert Martinez'}</p>
                    <p className="text-[11px] text-gray-500">Faculty Supervisor</p>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-gray-200 bg-gray-50 space-y-2">
                  <p className="font-semibold text-gray-900">Allocated Team</p>
                  <p className="text-gray-600 font-medium">{project.allocatedTeam?.name || 'GeoPath Innovators'}</p>
                  <div className="pt-2 divide-y divide-gray-200">
                    <div className="py-1 flex justify-between items-center">
                      <span className="text-gray-700">Alex Chen</span>
                      <Badge variant="purple">Lead</Badge>
                    </div>
                    <div className="py-1 flex justify-between items-center">
                      <span className="text-gray-700">Maya Patel</span>
                      <span className="text-gray-400">Developer</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: MILESTONES */}
      {activeTab === 'MILESTONES' && (
        <Card className="shadow-none border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle>Milestone Roadmap</CardTitle>
              <CardDescription>Track deliverable submissions and supervisor reviews</CardDescription>
            </div>
            <Badge variant="success">All Stages Configured</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {project.milestones?.map((m, idx) => (
                <div key={m.id} className="p-3.5 rounded-lg border border-gray-200 bg-white space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-700">
                        {idx + 1}
                      </span>
                      <h4 className="font-semibold text-gray-900 text-sm">{m.title}</h4>
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
                        {m.status.replace(/_/g, ' ')}
                      </Badge>
                      <span className="text-xs text-gray-500 font-medium">{m.weightage}%</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 pl-7">{m.description}</p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pl-7 pt-2 border-t border-gray-100 text-xs">
                    <span className="flex items-center gap-1.5 text-gray-500">
                      <Calendar className="w-3.5 h-3.5" /> Due: {formatDate(m.dueDate)}
                    </span>

                    {m.deliverableUrl && (
                      <a
                        href={m.deliverableUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        <ExternalLink className="w-3 h-3" /> Submitted Link
                      </a>
                    )}

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
                            {m.deliverableUrl ? 'Update' : 'Submit'}
                          </Button>
                        )}
                      </div>
                    )}

                    {(role === 'SUPERVISOR' || role === 'ADMIN') && (
                      <div>
                        {reviewMilestoneId === m.id ? (
                          <div className="flex flex-col gap-2 p-2 rounded-md bg-gray-50 border border-gray-200">
                            <Input
                              placeholder="Feedback..."
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
                            <FileCheck2 className="w-3.5 h-3.5 mr-1" /> Review
                          </Button>
                        )}
                      </div>
                    )}
                  </div>

                  {m.feedback && (
                    <div className="ml-7 text-xs text-indigo-700 bg-indigo-50 p-2.5 rounded border border-indigo-100">
                      <strong>Feedback:</strong> {m.feedback}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 3: MEETING LOGS */}
      {activeTab === 'MEETINGS' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-none border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle>Supervisor Meeting Minutes</CardTitle>
                <CardDescription>Official meeting logs, discussions, and agreed action items</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {project.supervisorLogs?.map((log) => (
                  <div key={log.id} className="p-3.5 rounded-lg border border-gray-200 bg-white space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-gray-900">
                        Date: {formatDate(log.meetingDate)}
                      </span>
                      <span className="text-amber-600 font-medium">
                        Rating: {'★'.repeat(log.satisfactionRating || 5)}
                      </span>
                    </div>

                    <div className="text-xs text-gray-500">
                      <strong>Attendees:</strong> {log.attendees}
                    </div>

                    <div className="text-xs text-gray-700 bg-gray-50 p-2.5 rounded border border-gray-200 space-y-1">
                      <p className="font-semibold text-gray-900">Discussion Points:</p>
                      <p>{log.discussionPoints}</p>
                    </div>

                    <div className="text-xs text-indigo-700 bg-indigo-50 p-2.5 rounded border border-indigo-100 space-y-0.5">
                      <p className="font-semibold text-indigo-900">Action Items:</p>
                      <p className="whitespace-pre-line">{log.actionItems}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {(role === 'SUPERVISOR' || role === 'ADMIN') ? (
              <Card className="shadow-none border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-1.5">
                    <PlusCircle className="w-4 h-4 text-blue-600" /> Record Meeting Log
                  </CardTitle>
                  <CardDescription>Log minutes and assign team action items</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRecordMeeting} className="space-y-3 text-xs">
                    <Input
                      label="Date"
                      type="date"
                      value={meetingDate}
                      onChange={(e) => setMeetingDate(e.target.value)}
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Discussion Points
                      </label>
                      <textarea
                        rows={3}
                        value={discussionPoints}
                        onChange={(e) => setDiscussionPoints(e.target.value)}
                        className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
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
                        className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                    </div>
                    <Button type="submit" size="sm" className="w-full mt-1" isLoading={isRecordingMeeting}>
                      Save Meeting Log
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-none border-gray-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Continuous Supervision</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-gray-500 leading-relaxed">
                  Your supervisor logs regular check-ins. All assigned action items appear here automatically.
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: EVALUATIONS */}
      {activeTab === 'EVALUATIONS' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-none border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle>Independent Evaluations</CardTitle>
                  <CardDescription>Submitted marks from faculty evaluators</CardDescription>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-gray-900">{avgTotalScore}</span>
                  <span className="text-xs text-gray-400"> / 100</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {project.evaluations?.map((ev, idx) => (
                  <div key={ev.id} className="p-3.5 rounded-lg border border-gray-200 bg-white space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm">
                          Examiner {idx + 1}: {ev.examinerName}
                        </h4>
                        <p className="text-[11px] text-gray-500">{ev.examinerDepartment}</p>
                      </div>
                      <Badge variant={ev.isSubmitted ? 'success' : 'warning'}>
                        {ev.isSubmitted ? `${ev.totalScore} / 100` : 'Pending'}
                      </Badge>
                    </div>

                    {ev.isSubmitted && (
                      <>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs">
                          <div className="p-1.5 rounded bg-gray-50 border border-gray-100">
                            <p className="text-[10px] text-gray-500">Tech (25)</p>
                            <p className="font-bold text-gray-900">{ev.technicalImplementationScore}</p>
                          </div>
                          <div className="p-1.5 rounded bg-gray-50 border border-gray-100">
                            <p className="text-[10px] text-gray-500">Problem (15)</p>
                            <p className="font-bold text-gray-900">{ev.problemUnderstandingScore}</p>
                          </div>
                          <div className="p-1.5 rounded bg-gray-50 border border-gray-100">
                            <p className="text-[10px] text-gray-500">Innov (15)</p>
                            <p className="font-bold text-gray-900">{ev.innovationScore}</p>
                          </div>
                          <div className="p-1.5 rounded bg-gray-50 border border-gray-100">
                            <p className="text-[10px] text-gray-500">Doc (15)</p>
                            <p className="font-bold text-gray-900">{ev.documentationScore}</p>
                          </div>
                          <div className="p-1.5 rounded bg-gray-50 border border-gray-100">
                            <p className="text-[10px] text-gray-500">Pres (15)</p>
                            <p className="font-bold text-gray-900">{ev.presentationScore}</p>
                          </div>
                          <div className="p-1.5 rounded bg-gray-50 border border-gray-100">
                            <p className="text-[10px] text-gray-500">Outcome (15)</p>
                            <p className="font-bold text-gray-900">{ev.projectOutcomeScore}</p>
                          </div>
                        </div>

                        <div className="text-xs text-gray-700 bg-gray-50 p-2.5 rounded border border-gray-200">
                          <strong>Viva Remarks:</strong> {ev.comments}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="shadow-none border-gray-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Rubric Assessment Radar</CardTitle>
                <CardDescription className="text-xs">Composite score distribution</CardDescription>
              </CardHeader>
              <CardContent className="h-[250px] w-full pt-0 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={avgCriteria}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="subject" stroke="#6b7280" tick={{ fontSize: 9 }} />
                    <PolarRadiusAxis stroke="#e5e7eb" tick={{ fontSize: 8 }} />
                    <Radar
                      name="Score"
                      dataKey="score"
                      stroke="#4f46e5"
                      fill="#4f46e5"
                      fillOpacity={0.15}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 5: ORIGINALITY & IP */}
      {activeTab === 'ORIGINALITY_IP' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-none border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                Originality & Verification
              </CardTitle>
              <CardDescription>Academic integrity compliance report</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="p-3.5 rounded-lg border border-gray-200 bg-gray-50 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Document:</span>
                  <span className="font-semibold text-gray-900">Project Report & Source Code</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Similarity Index:</span>
                  <Badge variant="success">12.0% Verified</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Status:</span>
                  <span className="font-medium text-emerald-600">Approved by Committee</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-none border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-600" />
                IP Governance
              </CardTitle>
              <CardDescription>Corporate agreements and rights</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="p-3.5 rounded-lg border border-gray-200 bg-gray-50 space-y-2">
                <div className="flex justify-between py-1 border-b border-gray-200">
                  <span className="text-gray-500">Ownership:</span>
                  <span className="font-medium text-gray-900">Joint Academic / Steerpath Sponsor</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-200">
                  <span className="text-gray-500">Confidentiality:</span>
                  <Badge variant="warning">CONFIDENTIAL (NDA Active)</Badge>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">Agreement:</span>
                  <span className="font-medium text-gray-900">Steerpath_NDA_Signed_2026.pdf</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
