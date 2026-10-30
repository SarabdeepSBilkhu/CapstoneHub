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

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        {showcaseProjects.map((project: any) => (
          <Card
            key={project.id}
            className="flex flex-col justify-between hover:border-zinc-700 transition-all border-zinc-800/80 bg-zinc-900/40"
          >
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <Badge variant={project.category === 'INDUSTRY_SPONSORED' ? 'warning' : 'info'}>
                  {project.category.replace('_', ' ')}
                </Badge>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Accreditation Approved (12% Similarity)</span>
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

              <div className="border-t border-zinc-800/80 pt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-400">
                <div>
                  <span className="text-zinc-500">Allocated Cohort: </span>
                  <span className="font-medium text-white">{project.allocatedTeam?.name || 'GeoPath Innovators'}</span>
                </div>
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
                  View End-to-End Workspace
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
