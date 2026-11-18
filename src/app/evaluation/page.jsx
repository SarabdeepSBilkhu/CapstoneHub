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
    comments: 'Clean JavaScript code and modular architecture. Deployment verified.',
  },
];

const EXAMINERS = [
  { name: 'Prof. Sarah Jenkins', dept: 'Information Technology', title: 'Lead Technical Evaluator', email: 'examiner@capstonehub.edu' },
  { name: 'Dr. Vivek Sharma', dept: 'Computer Science & Engineering', title: 'External Assessment Chair', email: 'examiner2@capstonehub.edu' },
  { name: 'Prof. Claire Dubois', dept: 'Software Engineering', title: 'Industry Liaison Member', email: 'examiner3@capstonehub.edu' },
];

export default function EvaluationPage() {
  const { toast } = useToast();

  const [currentUser, setCurrentUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
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

  useEffect(() => {
    fetch('/api/auth/session')
      .then((r) => r.json())
      .then(({ user }) => {
        setCurrentUser(user);
        if (user?.role === 'EXAMINER') {
          const idx = EXAMINERS.findIndex((ex) => ex.email === user.email);
          const resolvedIdx = (idx >= 0 ? idx : 0);
          setMyExaminerIndex(resolvedIdx);
          setViewingIndex(resolvedIdx);
          loadDefaults(resolvedIdx);
        } else if (user?.role === 'ADMIN') {
          setMyExaminerIndex(null);
          setViewingIndex(0);
          loadDefaults(0);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoadingUser(false));
  }, []);

  function loadDefaults(idx) {
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
    { subject: 'Technical (25)', score: techScore, fullMark: 25 },
    { subject: 'Problem (15)', score: problemScore, fullMark: 15 },
    { subject: 'Innovation (15)', score: innovScore, fullMark: 15 },
    { subject: 'Documentation (15)', score: docScore, fullMark: 15 },
    { subject: 'Presentation (15)', score: presScore, fullMark: 15 },
    { subject: 'Outcome (15)', score: outcomeScore, fullMark: 15 },
  ];

  const handleSubmitEvaluation = async (e) => {
    e.preventDefault();
    if (myExaminerIndex === null) return;
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

      toast(resData.message || 'Evaluation recorded successfully!', 'success');
      setSubmitted(true);
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAdminView = currentUser?.role === 'ADMIN';
  const isReadOnly = isAdminView;
  const activeExaminer = EXAMINERS[viewingIndex];

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
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Multi-Examiner Evaluation</h1>
            <Badge variant="purple">3 Evaluators</Badge>
            {isReadOnly && (
              <Badge variant="warning" className="flex items-center gap-1">
                <Eye className="w-3 h-3" /> Admin Read-Only
              </Badge>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Evaluating <strong className="text-gray-900">Smart Campus Navigation System</strong> across 6 criteria.
          </p>
        </div>

        {/* Examiner Tabs */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-md border border-gray-200">
          {EXAMINERS.map((ex, idx) => {
            const isLocked = !isAdminView && myExaminerIndex !== null && myExaminerIndex !== idx;
            return (
              <button
                key={ex.name}
                type="button"
                disabled={isLocked}
                onClick={() => {
                  if (isLocked) return;
                  setViewingIndex(idx);
                  loadDefaults(idx);
                }}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  viewingIndex === idx
                    ? 'bg-white text-gray-900 shadow-sm'
                    : isLocked
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:text-gray-900 cursor-pointer'
                }`}
              >
                {isLocked && <Lock className="w-3 h-3 inline mr-1 text-gray-400" />}
                Examiner {idx + 1}
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
                  <span className="ml-2 text-amber-600 font-medium">— Read-only view</span>
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
                    Admins can view but not edit scores
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
                Distinction (A+)
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
