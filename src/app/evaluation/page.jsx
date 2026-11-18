'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/context/toast-context';
import { Scale, Lock, CheckCircle2, Eye } from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';

const EXAMINER_DEFAULTS = [
  {
    tech: 24, problem: 14.5, innov: 14, doc: 14.5, pres: 14, outcome: 14.5,
    comments: 'Exceptional system architecture and solid delivery.',
  },
  {
    tech: 23.5, problem: 14, innov: 14.5, doc: 14, pres: 14.5, outcome: 14,
    comments: 'High practical utility. Clean implementation and solid defense.',
  },
  {
    tech: 23, problem: 14.5, innov: 13.5, doc: 14.5, pres: 14, outcome: 14,
    comments: 'Clean code and modular architecture. Deployment verified.',
  },
];

const EXAMINERS = [
  { name: 'Prof. Sarah Jenkins', dept: 'Information Technology', title: 'Lead Technical Evaluator', email: 'examiner@capstonehub.edu' },
  { name: 'Dr. Vivek Sharma', dept: 'Computer Science & Engineering', title: 'External Assessment Chair', email: 'examiner2@capstonehub.edu' },
  { name: 'Prof. Claire Dubois', dept: 'Software Engineering', title: 'Industry Liaison Member', email: 'examiner3@capstonehub.edu' },
];

export default function EvaluationPage() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const initialProjectId = searchParams.get('projectId');

  const [currentUser, setCurrentUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(initialProjectId || '');
  const [evaluationsMap, setEvaluationsMap] = useState({});

  const [myExaminerIndex, setMyExaminerIndex] = useState(null);
  const [viewingIndex, setViewingIndex] = useState(0);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [techScore, setTechScore] = useState(EXAMINER_DEFAULTS[0].tech);
  const [problemScore, setProblemScore] = useState(EXAMINER_DEFAULTS[0].problem);
  const [innovScore, setInnovScore] = useState(EXAMINER_DEFAULTS[0].innov);
  const [docScore, setDocScore] = useState(EXAMINER_DEFAULTS[0].doc);
  const [presScore, setPresScore] = useState(EXAMINER_DEFAULTS[0].pres);
  const [outcomeScore, setOutcomeScore] = useState(EXAMINER_DEFAULTS[0].outcome);
  const [comments, setComments] = useState(EXAMINER_DEFAULTS[0].comments);

  // 1. Fetch current user session
  useEffect(() => {
    fetch('/api/auth/session')
      .then((r) => r.json())
      .then(({ user }) => {
        setCurrentUser(user);
        if (user?.role === 'EXAMINER') {
          const idx = EXAMINERS.findIndex((ex) => ex.email === user.email);
          const resolvedIdx = idx >= 0 ? idx : 0;
          setMyExaminerIndex(resolvedIdx);
          setViewingIndex(resolvedIdx);
        } else if (user?.role === 'ADMIN') {
          setMyExaminerIndex(null);
          setViewingIndex(0);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoadingUser(false));
  }, []);

  // 2. Fetch projects list
  useEffect(() => {
    fetch('/api/projects')
      .then((r) => r.json())
      .then((data) => {
        if (data.projects && data.projects.length > 0) {
          setProjects(data.projects);
          if (!selectedProjectId) {
            const preferSmart = data.projects.find((p) => p.id === 'smart-campus-nav');
            setSelectedProjectId(preferSmart ? preferSmart.id : data.projects[0].id);
          }
        }
      })
      .catch(() => {});
  }, []);

  // 3. Fetch evaluations whenever selectedProjectId changes
  useEffect(() => {
    if (!selectedProjectId) return;
    fetch(`/api/evaluations?projectId=${selectedProjectId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.evaluations) {
          const map = {};
          data.evaluations.forEach((ev) => {
            const examinerIdx = EXAMINERS.findIndex((ex) => ex.name === ev.examiner?.name || ex.id === ev.examinerId);
            if (examinerIdx >= 0) {
              map[examinerIdx] = ev;
            }
          });
          setEvaluationsMap(map);
          loadScoresForIndex(viewingIndex, map);
        }
      })
      .catch(() => {
        loadScoresForIndex(viewingIndex, {});
      });
  }, [selectedProjectId]);

  const loadScoresForIndex = (idx, currentMap = evaluationsMap) => {
    const existing = currentMap[idx];
    if (existing) {
      setTechScore(existing.technicalImplementationScore ?? EXAMINER_DEFAULTS[idx].tech);
      setProblemScore(existing.problemUnderstandingScore ?? EXAMINER_DEFAULTS[idx].problem);
      setInnovScore(existing.innovationScore ?? EXAMINER_DEFAULTS[idx].innov);
      setDocScore(existing.documentationScore ?? EXAMINER_DEFAULTS[idx].doc);
      setPresScore(existing.presentationScore ?? EXAMINER_DEFAULTS[idx].pres);
      setOutcomeScore(existing.projectOutcomeScore ?? EXAMINER_DEFAULTS[idx].outcome);
      setComments(existing.comments || EXAMINER_DEFAULTS[idx].comments);
      setSubmitted(Boolean(existing.isSubmitted));
    } else {
      const d = EXAMINER_DEFAULTS[idx] || EXAMINER_DEFAULTS[0];
      setTechScore(d.tech);
      setProblemScore(d.problem);
      setInnovScore(d.innov);
      setDocScore(d.doc);
      setPresScore(d.pres);
      setOutcomeScore(d.outcome);
      setComments(d.comments);
      setSubmitted(false);
    }
  };

  const handleSelectExaminerTab = (idx) => {
    setViewingIndex(idx);
    loadScoresForIndex(idx);
  };

  const totalScore = Number(
    (techScore + problemScore + innovScore + docScore + presScore + outcomeScore).toFixed(1)
  );

  const radarData = [
    { subject: 'Technical (25)', score: techScore, fullMark: 25 },
    { subject: 'Problem (15)', score: problemScore, fullMark: 15 },
    { subject: 'Innovation (15)', score: innovScore, fullMark: 15 },
    { subject: 'Documentation (15)', score: docScore, fullMark: 15 },
    { subject: 'Presentation (15)', score: presScore, fullMark: 15 },
    { subject: 'Outcome (15)', score: outcomeScore, fullMark: 15 },
  ];

  const handleSubmitEvaluation = async (e) => {
    e.preventDefault();
    if (myExaminerIndex === null || myExaminerIndex !== viewingIndex) {
      toast('You can only submit scores for your own examiner identity.', 'error');
      return;
    }
    if (!selectedProjectId) {
      toast('No project selected to evaluate.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        projectId: selectedProjectId,
        technicalImplementationScore: techScore,
        problemUnderstandingScore: problemScore,
        innovationScore: innovScore,
        documentationScore: docScore,
        presentationScore: presScore,
        projectOutcomeScore: outcomeScore,
        comments,
      };

      const res = await fetch('/api/evaluations/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Failed to submit evaluation');

      toast(resData.message || 'Evaluation recorded successfully!', 'success');
      setSubmitted(true);

      // Update map
      if (resData.evaluation) {
        setEvaluationsMap((prev) => ({
          ...prev,
          [viewingIndex]: resData.evaluation,
        }));
      }
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAdminView = currentUser?.role === 'ADMIN';
  // Read-only if user is admin, or if examiner is viewing another examiner's tab
  const isReadOnly = isAdminView || (myExaminerIndex !== null && myExaminerIndex !== viewingIndex);
  const activeExaminer = EXAMINERS[viewingIndex];
  const activeProject = projects.find((p) => p.id === selectedProjectId);

  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-400 text-sm">Loading evaluation panel…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Multi-Examiner Evaluation</h1>
            <Badge variant="purple">3 Evaluators</Badge>
            {isReadOnly && (
              <Badge variant="warning" className="flex items-center gap-1">
                <Eye className="w-3 h-3" /> {isAdminView ? 'Admin Read-Only' : 'Viewing Another Examiner (Read-Only)'}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 pt-1 flex-wrap text-sm text-gray-600">
            <span>Evaluating Project:</span>
            {projects.length > 0 ? (
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="h-8 px-2.5 rounded-md border border-gray-300 bg-white text-xs font-semibold text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            ) : (
              <strong className="text-gray-900">{activeProject?.title || 'Loading project...'}</strong>
            )}
          </div>
        </div>

        {/* Examiner Tabs */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-md border border-gray-200">
          {EXAMINERS.map((ex, idx) => {
            const isMyIdentity = myExaminerIndex === idx;
            return (
              <button
                key={ex.name}
                type="button"
                onClick={() => handleSelectExaminerTab(idx)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer ${
                  viewingIndex === idx
                    ? 'bg-white text-gray-900 shadow-sm font-semibold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {!isAdminView && !isMyIdentity && <Lock className="w-3 h-3 inline mr-1 text-gray-400" />}
                Examiner {idx + 1}
                {isMyIdentity && <span className="ml-1 text-[10px] text-indigo-600 font-bold">(You)</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rubric Evaluation Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-none border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-indigo-600" />
                {isReadOnly ? 'Viewing' : 'Marksheet'}: {activeExaminer.name}
              </CardTitle>
              <CardDescription>
                {activeExaminer.title} • {activeExaminer.dept}
                {isReadOnly && (
                  <span className="ml-2 text-amber-600 font-medium">
                    — {isAdminView ? 'Read-only view' : 'Only this examiner can submit their score'}
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitEvaluation} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <Input
                    label="1. Technical Implementation (Max 25)"
                    type="number"
                    step="0.5"
                    max={25}
                    min={0}
                    value={techScore}
                    readOnly={isReadOnly}
                    onChange={(e) => !isReadOnly && setTechScore(Number(e.target.value))}
                    className={isReadOnly ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}
                  />
                  <Input
                    label="2. Problem Understanding (Max 15)"
                    type="number"
                    step="0.5"
                    max={15}
                    min={0}
                    value={problemScore}
                    readOnly={isReadOnly}
                    onChange={(e) => !isReadOnly && setProblemScore(Number(e.target.value))}
                    className={isReadOnly ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}
                  />
                  <Input
                    label="3. Innovation & Novelty (Max 15)"
                    type="number"
                    step="0.5"
                    max={15}
                    min={0}
                    value={innovScore}
                    readOnly={isReadOnly}
                    onChange={(e) => !isReadOnly && setInnovScore(Number(e.target.value))}
                    className={isReadOnly ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}
                  />
                  <Input
                    label="4. Documentation & Schema (Max 15)"
                    type="number"
                    step="0.5"
                    max={15}
                    min={0}
                    value={docScore}
                    readOnly={isReadOnly}
                    onChange={(e) => !isReadOnly && setDocScore(Number(e.target.value))}
                    className={isReadOnly ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}
                  />
                  <Input
                    label="5. Presentation & Viva (Max 15)"
                    type="number"
                    step="0.5"
                    max={15}
                    min={0}
                    value={presScore}
                    readOnly={isReadOnly}
                    onChange={(e) => !isReadOnly && setPresScore(Number(e.target.value))}
                    className={isReadOnly ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}
                  />
                  <Input
                    label="6. Project Deliverable (Max 15)"
                    type="number"
                    step="0.5"
                    max={15}
                    min={0}
                    value={outcomeScore}
                    readOnly={isReadOnly}
                    onChange={(e) => !isReadOnly && setOutcomeScore(Number(e.target.value))}
                    className={isReadOnly ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}
                  />
                </div>

                <div className="space-y-1 pt-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Qualitative Feedback & Comments
                  </label>
                  <textarea
                    rows={3}
                    value={comments}
                    readOnly={isReadOnly}
                    onChange={(e) => !isReadOnly && setComments(e.target.value)}
                    className={`w-full rounded-md border border-gray-300 p-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 ${isReadOnly ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`}
                  />
                </div>

                {!isReadOnly && (
                  submitted ? (
                    <div className="flex items-center gap-2 justify-center w-full py-2.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      Score submitted successfully as {activeExaminer.name}
                    </div>
                  ) : (
                    <Button type="submit" className="w-full" isLoading={isSubmitting}>
                      Submit Score as {activeExaminer.name}
                    </Button>
                  )
                )}

                {isReadOnly && (
                  <div className="flex items-center gap-1.5 justify-center w-full py-2 rounded-md bg-gray-50 border border-gray-200 text-gray-500 text-xs">
                    <Lock className="w-3.5 h-3.5" />
                    {isAdminView
                      ? 'Admins can view but not edit examiner scores'
                      : `Scores can only be submitted when logged in as ${activeExaminer.name}`}
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Live Score & Radar Chart */}
        <div className="space-y-6">
          <Card className="shadow-none border-gray-200 text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Calculated Score</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center pb-5">
              <div className="text-4xl font-extrabold text-gray-900">
                {totalScore}
                <span className="text-xl text-gray-400 font-normal"> / 100</span>
              </div>
              <Badge variant="success" className="mt-2 text-xs px-2.5 py-0.5">
                {totalScore >= 85 ? 'Distinction (A+)' : totalScore >= 70 ? 'Merit (A)' : 'Pass'}
              </Badge>
            </CardContent>
          </Card>

          <Card className="shadow-none border-gray-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Competency Radar</CardTitle>
            </CardHeader>
            <CardContent className="h-[240px] w-full pt-0 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
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
    </div>
  );
}
