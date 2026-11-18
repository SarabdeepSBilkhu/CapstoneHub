'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/context/toast-context';
import { Scale, Lock, CheckCircle2, Eye, AlertCircle, Save, Clock } from 'lucide-react';
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
  { id: 'usr_examiner_1', name: 'Prof. Sarah Jenkins', dept: 'Information Technology', title: 'Lead Technical Evaluator', email: 'examiner@capstonehub.edu' },
  { id: 'usr_examiner_2', name: 'Dr. Vivek Sharma', dept: 'Computer Science & Engineering', title: 'External Assessment Chair', email: 'examiner2@capstonehub.edu' },
  { id: 'usr_examiner_3', name: 'Prof. Claire Dubois', dept: 'Software Engineering', title: 'Industry Liaison Member', email: 'examiner3@capstonehub.edu' },
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
  const [isLoadingEvals, setIsLoadingEvals] = useState(false);

  const [myExaminerIndex, setMyExaminerIndex] = useState(null);
  const [viewingIndex, setViewingIndex] = useState(0);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form values
  const [techScore, setTechScore] = useState(EXAMINER_DEFAULTS[0].tech);
  const [problemScore, setProblemScore] = useState(EXAMINER_DEFAULTS[0].problem);
  const [innovScore, setInnovScore] = useState(EXAMINER_DEFAULTS[0].innov);
  const [docScore, setDocScore] = useState(EXAMINER_DEFAULTS[0].doc);
  const [presScore, setPresScore] = useState(EXAMINER_DEFAULTS[0].pres);
  const [outcomeScore, setOutcomeScore] = useState(EXAMINER_DEFAULTS[0].outcome);
  const [comments, setComments] = useState(EXAMINER_DEFAULTS[0].comments);

  // Saved database snapshot for change detection
  const [savedSnapshot, setSavedSnapshot] = useState(null);
  const [lastSubmittedAt, setLastSubmittedAt] = useState(null);
  const [isPersistedInDb, setIsPersistedInDb] = useState(false);

  // 1. Fetch current user session
  useEffect(() => {
    fetch('/api/auth/session')
      .then((r) => r.json())
      .then(({ user }) => {
        setCurrentUser(user);
        if (user?.role === 'EXAMINER') {
          const idx = EXAMINERS.findIndex(
            (ex) =>
              ex.email.toLowerCase() === user.email?.toLowerCase() ||
              ex.name.toLowerCase() === user.name?.toLowerCase() ||
              ex.id === user.id
          );
          const resolvedIdx = idx >= 0 ? idx : 0;
          setMyExaminerIndex(resolvedIdx);
          setViewingIndex(resolvedIdx);
        } else if (user?.role === 'ADMIN') {
          setMyExaminerIndex(null);
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
  const fetchEvaluations = (projId) => {
    if (!projId) return;
    setIsLoadingEvals(true);
    fetch(`/api/evaluations?projectId=${projId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.evaluations) {
          const map = {};
          data.evaluations.forEach((ev) => {
            const examinerIdx = EXAMINERS.findIndex(
              (ex) =>
                ex.id === ev.examinerId ||
                ex.email.toLowerCase() === ev.examiner?.email?.toLowerCase() ||
                ex.name.toLowerCase() === ev.examiner?.name?.toLowerCase()
            );
            if (examinerIdx >= 0) {
              map[examinerIdx] = ev;
            }
          });
          setEvaluationsMap(map);
        }
      })
      .catch((err) => {
        console.error('Failed to load evaluations:', err);
      })
      .finally(() => {
        setIsLoadingEvals(false);
      });
  };

  useEffect(() => {
    if (selectedProjectId) {
      fetchEvaluations(selectedProjectId);
    }
  }, [selectedProjectId]);

  // 4. Synchronize form inputs whenever viewingIndex or evaluationsMap changes
  useEffect(() => {
    const existing = evaluationsMap[viewingIndex];
    if (existing) {
      const t = existing.technicalImplementationScore ?? EXAMINER_DEFAULTS[viewingIndex]?.tech ?? 0;
      const p = existing.problemUnderstandingScore ?? EXAMINER_DEFAULTS[viewingIndex]?.problem ?? 0;
      const i = existing.innovationScore ?? EXAMINER_DEFAULTS[viewingIndex]?.innov ?? 0;
      const d = existing.documentationScore ?? EXAMINER_DEFAULTS[viewingIndex]?.doc ?? 0;
      const pr = existing.presentationScore ?? EXAMINER_DEFAULTS[viewingIndex]?.pres ?? 0;
      const o = existing.projectOutcomeScore ?? EXAMINER_DEFAULTS[viewingIndex]?.outcome ?? 0;
      const c = existing.comments || EXAMINER_DEFAULTS[viewingIndex]?.comments || '';

      setTechScore(t);
      setProblemScore(p);
      setInnovScore(i);
      setDocScore(d);
      setPresScore(pr);
      setOutcomeScore(o);
      setComments(c);
      setLastSubmittedAt(existing.submittedAt || existing.updatedAt || null);
      setIsPersistedInDb(Boolean(existing.isSubmitted));
      setSavedSnapshot({ tech: t, problem: p, innov: i, doc: d, pres: pr, outcome: o, comments: c });
    } else {
      const def = EXAMINER_DEFAULTS[viewingIndex] || EXAMINER_DEFAULTS[0];
      setTechScore(def.tech);
      setProblemScore(def.problem);
      setInnovScore(def.innov);
      setDocScore(def.doc);
      setPresScore(def.pres);
      setOutcomeScore(def.outcome);
      setComments(def.comments);
      setLastSubmittedAt(null);
      setIsPersistedInDb(false);
      setSavedSnapshot(null);
    }
  }, [viewingIndex, evaluationsMap]);

  // Check if form has unsaved modifications
  const hasUnsavedChanges = useMemo(() => {
    if (!savedSnapshot) return true; // not saved in DB yet
    return (
      Number(techScore) !== Number(savedSnapshot.tech) ||
      Number(problemScore) !== Number(savedSnapshot.problem) ||
      Number(innovScore) !== Number(savedSnapshot.innov) ||
      Number(docScore) !== Number(savedSnapshot.doc) ||
      Number(presScore) !== Number(savedSnapshot.pres) ||
      Number(outcomeScore) !== Number(savedSnapshot.outcome) ||
      comments.trim() !== savedSnapshot.comments.trim()
    );
  }, [techScore, problemScore, innovScore, docScore, presScore, outcomeScore, comments, savedSnapshot]);

  // Safe numerical calculations
  const safeTech = Number(techScore) || 0;
  const safeProblem = Number(problemScore) || 0;
  const safeInnov = Number(innovScore) || 0;
  const safeDoc = Number(docScore) || 0;
  const safePres = Number(presScore) || 0;
  const safeOutcome = Number(outcomeScore) || 0;
  const totalScore = Number(
    (safeTech + safeProblem + safeInnov + safeDoc + safePres + safeOutcome).toFixed(1)
  );

  const radarData = [
    { subject: 'Technical (25)', score: safeTech, fullMark: 25 },
    { subject: 'Problem (15)', score: safeProblem, fullMark: 15 },
    { subject: 'Innovation (15)', score: safeInnov, fullMark: 15 },
    { subject: 'Documentation (15)', score: safeDoc, fullMark: 15 },
    { subject: 'Presentation (15)', score: safePres, fullMark: 15 },
    { subject: 'Outcome (15)', score: safeOutcome, fullMark: 15 },
  ];

  // Permissions & Role Access
  const isAdmin = currentUser?.role === 'ADMIN';
  const isExaminer = currentUser?.role === 'EXAMINER';
  const isMyTab = isExaminer && myExaminerIndex === viewingIndex;
  const canEdit = isAdmin || isMyTab;
  const isReadOnly = !canEdit;

  const activeExaminer = EXAMINERS[viewingIndex];
  const activeProject = projects.find((p) => p.id === selectedProjectId);

  const handleScoreChange = (setter, max) => (e) => {
    if (isReadOnly) return;
    const val = e.target.value;
    if (val === '') {
      setter('');
      return;
    }
    const num = parseFloat(val);
    if (isNaN(num)) return;
    if (num < 0) setter(0);
    else if (num > max) setter(max);
    else setter(num);
  };

  const handleSubmitEvaluation = async (e) => {
    e.preventDefault();
    if (!canEdit) {
      toast('You do not have permission to submit scores for this examiner.', 'error');
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
        examinerEmail: activeExaminer.email,
        examinerId: activeExaminer.id,
        technicalImplementationScore: safeTech,
        problemUnderstandingScore: safeProblem,
        innovationScore: safeInnov,
        documentationScore: safeDoc,
        presentationScore: safePres,
        projectOutcomeScore: safeOutcome,
        comments,
      };

      const res = await fetch('/api/evaluations/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Failed to submit evaluation');

      toast(resData.message || 'Evaluation score recorded in PostgreSQL!', 'success');

      // Update local state snapshot immediately
      if (resData.evaluation) {
        setEvaluationsMap((prev) => ({
          ...prev,
          [viewingIndex]: resData.evaluation,
        }));
        setIsPersistedInDb(true);
        setLastSubmittedAt(new Date().toISOString());
        setSavedSnapshot({
          tech: safeTech,
          problem: safeProblem,
          innov: safeInnov,
          doc: safeDoc,
          pres: safePres,
          outcome: safeOutcome,
          comments,
        });
      }
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            {isAdmin && (
              <Badge variant="warning" className="flex items-center gap-1">
                Admin Evaluation & Override
              </Badge>
            )}
            {!isAdmin && isReadOnly && (
              <Badge variant="outline" className="flex items-center gap-1 text-gray-600">
                <Eye className="w-3 h-3" /> Read-Only View
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
            {isLoadingEvals && <span className="text-xs text-gray-400 italic">Syncing live scores…</span>}
          </div>
        </div>

        {/* Examiner Tabs */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-md border border-gray-200">
          {EXAMINERS.map((ex, idx) => {
            const isMyIdentity = isExaminer && myExaminerIndex === idx;
            const hasEntry = evaluationsMap[idx]?.isSubmitted;
            return (
              <button
                key={ex.id}
                type="button"
                onClick={() => setViewingIndex(idx)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  viewingIndex === idx
                    ? 'bg-white text-gray-900 shadow-sm font-semibold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {!isAdmin && !isMyIdentity && <Lock className="w-3 h-3 text-gray-400" />}
                {hasEntry && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                <span>Examiner {idx + 1}</span>
                {isMyIdentity && <span className="text-[10px] text-indigo-600 font-bold">(You)</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rubric Evaluation Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-none border-gray-200">
            <CardHeader className="pb-3 border-b border-gray-100">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-indigo-600" />
                    Marksheet: {activeExaminer.name}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {activeExaminer.title} • {activeExaminer.dept}
                  </CardDescription>
                </div>

                {/* Status indicator */}
                <div className="text-right flex flex-col items-end">
                  {isPersistedInDb ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Saved in Database
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      <Clock className="w-3.5 h-3.5" />
                      Pending Evaluation
                    </span>
                  )}
                  {lastSubmittedAt && (
                    <span className="text-[10px] text-gray-400 mt-0.5">
                      Updated: {new Date(lastSubmittedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
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
                    onChange={handleScoreChange(setTechScore, 25)}
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
                    onChange={handleScoreChange(setProblemScore, 15)}
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
                    onChange={handleScoreChange(setInnovScore, 15)}
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
                    onChange={handleScoreChange(setDocScore, 15)}
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
                    onChange={handleScoreChange(setPresScore, 15)}
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
                    onChange={handleScoreChange(setOutcomeScore, 15)}
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
                    placeholder="Enter examiner notes, strengths, and areas of improvement..."
                    className={`w-full rounded-md border border-gray-300 p-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 ${
                      isReadOnly ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''
                    }`}
                  />
                </div>

                {/* Unsaved changes alert */}
                {canEdit && hasUnsavedChanges && (
                  <div className="flex items-center gap-2 p-2.5 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
                    <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>You have unsaved changes. Click below to save your updated scores to PostgreSQL.</span>
                  </div>
                )}

                {/* Action Button */}
                {canEdit ? (
                  <Button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2"
                    isLoading={isSubmitting}
                  >
                    <Save className="w-4 h-4" />
                    {isPersistedInDb
                      ? hasUnsavedChanges
                        ? `Save & Update Score as ${activeExaminer.name}`
                        : `Update Score as ${activeExaminer.name}`
                      : `Submit Score as ${activeExaminer.name}`}
                  </Button>
                ) : (
                  <div className="flex items-center gap-1.5 justify-center w-full py-2.5 rounded-md bg-gray-50 border border-gray-200 text-gray-500 text-xs">
                    <Lock className="w-3.5 h-3.5" />
                    {isExaminer
                      ? `This marksheet belongs to ${activeExaminer.name}. Switch to your tab to enter scores.`
                      : 'Logged in under read-only permissions for this marksheet.'}
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
              {hasUnsavedChanges && canEdit && (
                <span className="text-[11px] text-amber-600 font-medium mt-2">
                  • Modified (Pending Save)
                </span>
              )}
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
                  <PolarRadiusAxis stroke="#e5e7eb" tick={{ fontSize: 8 }} domain={[0, 25]} />
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
