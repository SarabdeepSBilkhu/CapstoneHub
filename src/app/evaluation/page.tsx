'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/context/toast-context';
import { Scale, Award, CheckCircle2, ShieldCheck } from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';

export default function EvaluationPage() {
  const { toast } = useToast();
  const [selectedExaminerIndex, setSelectedExaminerIndex] = useState<0 | 1 | 2>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 3 Independent Examiners roster
  const examiners = [
    { name: 'Prof. Sarah Jenkins', dept: 'Information Technology', title: 'Lead Technical Evaluator' },
    { name: 'Dr. Vivek Sharma', dept: 'Computer Science & Engineering', title: 'External Assessment Chair' },
    { name: 'Prof. Claire Dubois', dept: 'Software Engineering', title: 'Industry Liaison Member' },
  ];

  // 6 Criteria Standard Rubric state (Total = 100)
  const [techScore, setTechScore] = useState<number>(24);     // Max 25
  const [problemScore, setProblemScore] = useState<number>(14.5); // Max 15
  const [innovScore, setInnovScore] = useState<number>(14);     // Max 15
  const [docScore, setDocScore] = useState<number>(14.5);       // Max 15
  const [presScore, setPresScore] = useState<number>(14);       // Max 15
  const [outcomeScore, setOutcomeScore] = useState<number>(14.5); // Max 15
  const [comments, setComments] = useState<string>(
    'Exceptional system architecture. Multi-floor routing algorithm performs flawlessly with smooth SVG animations.'
  );

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
    } catch (err: any) {
      toast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-white">Multi-Examiner Evaluation</h1>
            <Badge variant="purple">3 Independent Faculty Evaluators</Badge>
          </div>
          <p className="mt-1 text-sm text-zinc-400">
            Evaluating <strong className="text-white">Smart Campus Navigation System</strong> across 6 standardized
            criteria according to the 100-mark departmental handbook.
          </p>
        </div>

        {/* Examiner Persona Switcher */}
        <div className="flex items-center gap-2 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
          {examiners.map((ex, idx) => (
            <button
              key={ex.name}
              type="button"
              onClick={() => {
                setSelectedExaminerIndex(idx as 0 | 1 | 2);
                if (idx === 1) {
                  setTechScore(23.5);
                  setProblemScore(14);
                  setInnovScore(14.5);
                  setDocScore(14);
                  setPresScore(14.5);
                  setOutcomeScore(14);
                  setComments('High practical utility. Wheelchair accessible routing demonstrates solid engineering empathy.');
                } else if (idx === 2) {
                  setTechScore(23);
                  setProblemScore(14.5);
                  setInnovScore(13.5);
                  setDocScore(14.5);
                  setPresScore(14);
                  setOutcomeScore(14);
                  setComments('Clean TypeScript code and modular architecture. Railway deployment is verified.');
                } else {
                  setTechScore(24);
                  setProblemScore(14.5);
                  setInnovScore(14);
                  setDocScore(14.5);
                  setPresScore(14);
                  setOutcomeScore(14.5);
                  setComments('Exceptional system architecture. Multi-floor routing algorithm performs flawlessly.');
                }
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                selectedExaminerIndex === idx
                  ? 'bg-indigo-600 text-white'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Examiner {idx + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Rubric Evaluation Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-indigo-400" />
                Individual Examiner Sheet: {examiners[selectedExaminerIndex].name}
              </CardTitle>
              <CardDescription>
                {examiners[selectedExaminerIndex].title} • {examiners[selectedExaminerIndex].dept}
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
                    onChange={(e) => setTechScore(Number(e.target.value))}
                  />
                  <Input
                    label="2. Problem Understanding (Max 15)"
                    type="number"
                    step="0.5"
                    max={15}
                    min={0}
                    value={problemScore}
                    onChange={(e) => setProblemScore(Number(e.target.value))}
                  />
                  <Input
                    label="3. Innovation & Novelty (Max 15)"
                    type="number"
                    step="0.5"
                    max={15}
                    min={0}
                    value={innovScore}
                    onChange={(e) => setInnovScore(Number(e.target.value))}
                  />
                  <Input
                    label="4. Documentation & Schema (Max 15)"
                    type="number"
                    step="0.5"
                    max={15}
                    min={0}
                    value={docScore}
                    onChange={(e) => setDocScore(Number(e.target.value))}
                  />
                  <Input
                    label="5. Presentation & Viva Defense (Max 15)"
                    type="number"
                    step="0.5"
                    max={15}
                    min={0}
                    value={presScore}
                    onChange={(e) => setPresScore(Number(e.target.value))}
                  />
                  <Input
                    label="6. Project Outcome & Deliverable (Max 15)"
                    type="number"
                    step="0.5"
                    max={15}
                    min={0}
                    value={outcomeScore}
                    onChange={(e) => setOutcomeScore(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                    Qualitative Feedback & Viva Comments
                  </label>
                  <textarea
                    rows={3}
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-950/70 p-3 text-xs text-zinc-100 placeholder:text-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <Button type="submit" className="w-full" isLoading={isSubmitting}>
                  Submit Score as {examiners[selectedExaminerIndex].name}
                </Button>
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
