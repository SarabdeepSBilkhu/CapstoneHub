'use client';

import React, { useState, useEffect } from 'react';
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

// Per-examiner default scores (index 0, 1, 2)
const EXAMINER_DEFAULTS = [
  {
    tech: 24, problem: 14.5, innov: 14, doc: 14.5, pres: 14, outcome: 14.5,
    comments: 'Exceptional system architecture. Multi-floor routing algorithm performs flawlessly with smooth SVG animations.',
  },
  {
    tech: 23.5, problem: 14, innov: 14.5, doc: 14, pres: 14.5, outcome: 14,
    comments: 'High practical utility. Wheelchair accessible routing demonstrates solid engineering empathy.',
  },
  {
    tech: 23, problem: 14.5, innov: 13.5, doc: 14.5, pres: 14, outcome: 14,
    comments: 'Clean TypeScript code and modular architecture. Railway deployment is verified.',
  },
];

const EXAMINERS = [
  { name: 'Prof. Sarah Jenkins', dept: 'Information Technology', title: 'Lead Technical Evaluator', email: 'examiner@capstonehub.edu' },
  { name: 'Dr. Vivek Sharma', dept: 'Computer Science & Engineering', title: 'External Assessment Chair', email: 'examiner2@capstonehub.edu' },
  { name: 'Prof. Claire Dubois', dept: 'Software Engineering', title: 'Industry Liaison Member', email: 'examiner3@capstonehub.edu' },
];

export default function EvaluationPage() {
  const { toast } = useToast();

  // Current logged-in user (fetched on mount)
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  // Which examiner index the current user maps to (or null for Admin read-only view)
  const [myExaminerIndex, setMyExaminerIndex] = useState<0 | 1 | 2 | null>(null);

  // Admin can browse all three in read-only mode
  const [viewingIndex, setViewingIndex] = useState<0 | 1 | 2>(0);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Score form state (always reflects the viewing/editing examiner)
  const [techScore, setTechScore] = useState<number>(EXAMINER_DEFAULTS[0].tech);
  const [problemScore, setProblemScore] = useState<number>(EXAMINER_DEFAULTS[0].problem);
  const [innovScore, setInnovScore] = useState<number>(EXAMINER_DEFAULTS[0].innov);
  const [docScore, setDocScore] = useState<number>(EXAMINER_DEFAULTS[0].doc);
  const [presScore, setPresScore] = useState<number>(EXAMINER_DEFAULTS[0].pres);
  const [outcomeScore, setOutcomeScore] = useState<number>(EXAMINER_DEFAULTS[0].outcome);
  const [comments, setComments] = useState<string>(EXAMINER_DEFAULTS[0].comments);

  // Fetch current user on mount to determine role and lock the UI
  useEffect(() => {
    fetch('/api/auth/session')
      .then((r) => r.json())
      .then(({ user }) => {
        setCurrentUser(user);
        if (user?.role === 'EXAMINER') {
          // Map email → examiner index
          const idx = EXAMINERS.findIndex((ex) => ex.email === user.email);
          const resolvedIdx = (idx >= 0 ? idx : 0) as 0 | 1 | 2;
          setMyExaminerIndex(resolvedIdx);
          setViewingIndex(resolvedIdx);
          loadDefaults(resolvedIdx);
        } else if (user?.role === 'ADMIN') {
          // Admin reads all — start on index 0 read-only
          setMyExaminerIndex(null);
          setViewingIndex(0);
          loadDefaults(0);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoadingUser(false));
  }, []);

  function loadDefaults(idx: 0 | 1 | 2) {
    const d = EXAMINER_DEFAULTS[idx];
    setTechScore(d.tech);
    setProblemScore(d.problem);
    setInnovScore(d.innov);
    setDocScore(d.doc);
    setPresScore(d.pres);
    setOutcomeScore(d.outcome);
    setComments(d.comments);
    setSubmitted(false);
  }

  const totalScore = Number(
    (techScore + problemScore + innovScore + docScore + presScore + outcomeScore).toFixed(1)
  );

  const radarData = [
    { subject: 'Technical Impl (25)', score: techScore, fullMark: 25 },
    { subject: 'Problem (15)', score: problemScore, fullMark: 15 },
    { subject: 'Innovation (15)', score: innovScore, fullMark: 15 },
    { subject: 'Documentation (15)', score: docScore, fullMark: 15 },
    { subject: 'Presentation (15)', score: presScore, fullMark: 15 },
    { subject: 'Outcome (15)', score: outcomeScore, fullMark: 15 },
  ];

  const handleSubmitEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (myExaminerIndex === null) return; // admin cannot submit
    setIsSubmitting(true);
    try {
      const payload = {
        projectId: 'smart-campus-nav',
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

      toast(resData.message || 'Rubric evaluation recorded successfully!', 'success');
      setSubmitted(true);
    } catch (err: any) {
      toast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAdminView = currentUser?.role === 'ADMIN';
  const isReadOnly = isAdminView; // admins view but cannot edit/submit
  const activeExaminer = EXAMINERS[viewingIndex];

  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-zinc-400 text-sm animate-pulse">Loading evaluation panel…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-3xl font-bold tracking-tight text-white">Multi-Examiner Evaluation</h1>
            <Badge variant="purple">3 Independent Faculty Evaluators</Badge>
            {isReadOnly && (
              <Badge variant="warning" className="flex items-center gap-1">
                <Eye className="w-3 h-3" /> Admin Read-Only View
              </Badge>
            )}
          </div>
          <p className="mt-1 text-sm text-zinc-400">
            Evaluating <strong className="text-white">Smart Campus Navigation System</strong> across 6 standardized
            criteria according to the 100-mark departmental handbook.
          </p>
        </div>

        {/* Examiner selector — Admin browses read-only; Examiner sees only their own locked tab */}
        <div className="flex items-center gap-2 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
          {EXAMINERS.map((ex, idx) => {
            const isLocked = !isAdminView && myExaminerIndex !== null && myExaminerIndex !== idx;
            return (
              <button
                key={ex.name}
                type="button"
                disabled={isLocked}
                onClick={() => {
                  if (isLocked) return;
                  setViewingIndex(idx as 0 | 1 | 2);
                  loadDefaults(idx as 0 | 1 | 2);
                }}
                title={isLocked ? 'You can only grade as your assigned examiner identity' : undefined}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  viewingIndex === idx
                    ? 'bg-indigo-600 text-white'
                    : isLocked
                    ? 'text-zinc-600 cursor-not-allowed'
                    : 'text-zinc-400 hover:text-white cursor-pointer'
                }`}
              >
                {isLocked ? <Lock className="w-3 h-3 inline mr-1" /> : null}
                Examiner {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Rubric Evaluation Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-indigo-400" />
                {isReadOnly ? 'Viewing' : 'Individual Examiner Sheet'}:{' '}
                {activeExaminer.name}
              </CardTitle>
              <CardDescription>
                {activeExaminer.title} • {activeExaminer.dept}
                {isReadOnly && (
                  <span className="ml-2 text-amber-400 font-medium">— Read-only (Admin cannot submit scores)</span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitEvaluation} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="1. Technical Implementation (Max 25)"
                    type="number"
                    step="0.5"
                    max={25}
                    min={0}
                    value={techScore}
                    readOnly={isReadOnly}
                    onChange={(e) => !isReadOnly && setTechScore(Number(e.target.value))}
                    className={isReadOnly ? 'opacity-70 cursor-not-allowed' : ''}
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
                    className={isReadOnly ? 'opacity-70 cursor-not-allowed' : ''}
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
                    className={isReadOnly ? 'opacity-70 cursor-not-allowed' : ''}
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
                    className={isReadOnly ? 'opacity-70 cursor-not-allowed' : ''}
                  />
                  <Input
                    label="5. Presentation & Viva Defense (Max 15)"
                    type="number"
                    step="0.5"
                    max={15}
                    min={0}
                    value={presScore}
                    readOnly={isReadOnly}
                    onChange={(e) => !isReadOnly && setPresScore(Number(e.target.value))}
                    className={isReadOnly ? 'opacity-70 cursor-not-allowed' : ''}
                  />
                  <Input
                    label="6. Project Outcome & Deliverable (Max 15)"
                    type="number"
                    step="0.5"
                    max={15}
                    min={0}
                    value={outcomeScore}
                    readOnly={isReadOnly}
                    onChange={(e) => !isReadOnly && setOutcomeScore(Number(e.target.value))}
                    className={isReadOnly ? 'opacity-70 cursor-not-allowed' : ''}
                  />
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                    Qualitative Feedback & Viva Comments
                  </label>
                  <textarea
                    rows={3}
                    value={comments}
                    readOnly={isReadOnly}
                    onChange={(e) => !isReadOnly && setComments(e.target.value)}
                    className={`w-full rounded-lg border border-zinc-700 bg-zinc-950/70 p-3 text-xs text-zinc-100 placeholder:text-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 ${isReadOnly ? 'opacity-70 cursor-not-allowed' : ''}`}
                  />
                </div>

                {!isReadOnly && (
                  submitted ? (
                    <div className="flex items-center gap-2 justify-center w-full py-2 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-emerald-400 text-sm font-semibold">
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
                  <div className="flex items-center gap-2 justify-center w-full py-2 rounded-lg bg-zinc-900/60 border border-zinc-800 text-zinc-500 text-xs font-medium">
                    <Lock className="w-3.5 h-3.5" />
                    Submission locked — Admins can only view examiner scores
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Live Derived Radar Score Card */}
        <div className="space-y-6">
          <Card className="border-indigo-900/30 bg-indigo-950/20 text-center">
            <CardHeader>
              <CardTitle>Calculated Rubric Score</CardTitle>
              <CardDescription>Live derived sum across all 6 criteria</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center pt-2 pb-6">
              <div className="text-5xl font-extrabold text-white tracking-tight">
                {totalScore}
                <span className="text-2xl text-zinc-400 font-normal"> / 100</span>
              </div>
              <Badge variant="success" className="mt-3 text-xs px-3 py-1">
                Distinction Caliber (A+)
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Competency Assessment Radar</CardTitle>
              <CardDescription className="text-xs">Individual criteria distribution</CardDescription>
            </CardHeader>
            <CardContent className="h-[250px] w-full pt-0 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#3f3f46" />
                  <PolarAngleAxis dataKey="subject" stroke="#a1a1aa" tick={{ fontSize: 9 }} />
                  <PolarRadiusAxis stroke="#52525b" tick={{ fontSize: 8 }} />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.4}
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
