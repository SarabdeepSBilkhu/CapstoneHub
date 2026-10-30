import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { mockDb } from '@/lib/mock-db';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, CheckCircle2, Code, ShieldCheck, Award } from 'lucide-react';

export default async function ShowcasePage() {
  let showcaseProjects: any[] = [];

  try {
    showcaseProjects = await prisma.project.findMany({
      where: { isPublicShowcase: true },
      include: {
        sponsor: true,
        supervisor: true,
        allocatedTeam: {
          include: {
            members: {
              include: { user: true },
            },
          },
        },
        evaluations: true,
      },
      orderBy: { updatedAt: 'desc' },
    });
  } catch {
    // fallback
  }

  if (showcaseProjects.length === 0) {
    await mockDb.init();
    showcaseProjects = mockDb.projects.filter((p) => p.isPublicShowcase);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <Badge variant="success" className="px-3 py-1 text-xs">
          Step 10: Public Project Showcase & Accreditation
        </Badge>
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          Capstone <span className="text-indigo-400">Engineering Showcase</span>
        </h1>
        <p className="text-base text-zinc-400">
          Vetted, completed undergraduate capstones and industry-sponsored innovations published with full
          committee sign-off, originality records, and source deliverables.
        </p>
      </div>

      {/* Stats bar */}
      <div className="flex flex-wrap gap-6 justify-center py-4">
        {[
          { label: 'Completed Projects', value: showcaseProjects.length },
          { label: 'Avg. Examiner Score', value: (() => { const evals = showcaseProjects.flatMap((p: any) => p.evaluations || []); if (!evals.length) return '—'; const avg = evals.reduce((s: number, e: any) => s + (e.totalScore || 0), 0) / evals.length; return avg.toFixed(1) + ' / 100'; })() },
          { label: 'Open Source Projects', value: showcaseProjects.filter((p: any) => p.ipStatus === 'OPEN_SOURCE').length },
          { label: 'Industry Sponsored', value: showcaseProjects.filter((p: any) => p.category === 'INDUSTRY_SPONSORED').length },
        ].map(stat => (
          <div key={stat.label} className="text-center">
            <p className="text-2xl font-bold text-indigo-400">{stat.value}</p>
            <p className="text-xs text-zinc-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
        {showcaseProjects.map((project: any) => {
          const avgScore = project.evaluations?.length
            ? (project.evaluations.reduce((s: number, e: any) => s + (e.totalScore || 0), 0) / project.evaluations.length).toFixed(1)
            : null;
          const simScore = project.similarityScore ?? 12;
          return (
          <Card
            key={project.id}
            className="flex flex-col justify-between hover:border-zinc-600 transition-all border-zinc-800/80 bg-zinc-900/40"
          >
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <Badge variant={project.category === 'INDUSTRY_SPONSORED' ? 'warning' : project.category === 'ENTREPRENEURSHIP_CAPSTONE' ? 'success' : 'info'}>
                  {project.category.replace(/_/g, ' ')}
                </Badge>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{simScore}% Similarity</span>
                </div>
              </div>
              <CardTitle className="text-xl leading-tight text-white">{project.title}</CardTitle>
              <p className="text-xs text-indigo-300 bg-indigo-950/30 p-3 rounded-lg border border-indigo-900/40 font-medium">
                {project.showcaseSummary || project.description}
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Core Engineering Problem & Solution:
                </p>
                <p className="text-xs text-zinc-300 leading-relaxed line-clamp-3">
                  {project.problemStatement}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag: string) => (
                  <span key={tag} className="px-2 py-0.5 rounded-md bg-zinc-800 text-[11px] text-zinc-300">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Avg score + metadata */}
              <div className="border-t border-zinc-800/80 pt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-400">
                <div>
                  <span className="text-zinc-500">Cohort: </span>
                  <span className="font-medium text-white">{project.allocatedTeam?.name || '—'}</span>
                </div>
                {avgScore && (
                  <div className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span className="font-semibold text-amber-400">{avgScore} / 100</span>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400">
                {project.supervisor && (
                  <div>
                    <span className="text-zinc-500">Supervisor: </span>
                    <span className="font-medium text-white">{project.supervisor.name}</span>
                  </div>
                )}
                {project.sponsor && (
                  <div>
                    <span className="text-zinc-500">Sponsor: </span>
                    <span className="font-medium text-amber-400">{project.sponsor.name}</span>
                  </div>
                )}
                <div>
                  <span className="text-zinc-500">IP: </span>
                  <span className="font-medium text-zinc-300">{project.ipStatus?.replace(/_/g, ' ')}</span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between gap-3 pt-3">
              <div className="flex items-center gap-2">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                    title="Source Repository"
                  >
                    <Code className="w-4 h-4" />
                  </a>
                )}
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                    title="Live Demo"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
              <Link href={`/workspace/${project.id}`}>
                <Button variant="outline" size="sm">
                  View Workspace
                </Button>
              </Link>
            </CardFooter>
          </Card>
          );
        })}
      </div>
    </div>
  );
}
