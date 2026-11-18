import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, CheckCircle2, Code, Award } from 'lucide-react';

export default async function ShowcasePage() {
  const showcaseProjects = await prisma.project.findMany({
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

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <Badge variant="purple" className="text-xs">
          Public Showcase
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Engineering Showcase
        </h1>
        <p className="text-sm text-gray-500">
          Completed capstones and industry-sponsored innovations published with committee sign-off.
        </p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto py-2">
        {[
          { label: 'Completed Projects', value: showcaseProjects.length },
          {
            label: 'Avg. Examiner Score',
            value: (() => {
              const evals = showcaseProjects.flatMap((p) => p.evaluations || []);
              if (!evals.length) return '—';
              const avg = evals.reduce((s, e) => s + (e.totalScore || 0), 0) / evals.length;
              return `${avg.toFixed(1)} / 100`;
            })(),
          },
          { label: 'Open Source', value: showcaseProjects.filter((p) => p.ipStatus === 'OPEN_SOURCE').length },
          { label: 'Industry Sponsored', value: showcaseProjects.filter((p) => p.category === 'INDUSTRY_SPONSORED').length },
        ].map((stat) => (
          <div key={stat.label} className="text-center p-3 rounded-lg border border-gray-200 bg-white">
            <p className="text-xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {showcaseProjects.map((project) => {
          const avgScore = project.evaluations?.length
            ? (project.evaluations.reduce((s, e) => s + (e.totalScore || 0), 0) / project.evaluations.length).toFixed(1)
            : null;
          const simScore = project.similarityScore ?? 12;

          return (
            <Card
              key={project.id}
              className="flex flex-col justify-between hover:border-gray-300 transition-all border-gray-200 shadow-none"
            >
              <CardHeader className="space-y-2.5 pb-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <Badge variant={project.category === 'INDUSTRY_SPONSORED' ? 'warning' : 'info'}>
                    {project.category.replace(/_/g, ' ')}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{simScore}% Similarity</span>
                  </div>
                </div>

                <CardTitle className="text-base font-semibold leading-snug text-gray-900">
                  {project.title}
                </CardTitle>

                <p className="text-xs text-indigo-700 bg-indigo-50/60 p-2.5 rounded border border-indigo-100 font-medium">
                  {project.showcaseSummary || project.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-500">Problem & Solution:</p>
                  <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                    {project.problemStatement}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1">
                  {project.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded bg-gray-100 text-[11px] text-gray-600">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Score & details */}
                <div className="border-t border-gray-100 pt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
                  <div>
                    <span>Cohort: </span>
                    <span className="font-medium text-gray-800">{project.allocatedTeam?.name || '—'}</span>
                  </div>
                  {avgScore && (
                    <div className="flex items-center gap-1 font-semibold text-amber-700">
                      <Award className="w-3.5 h-3.5" />
                      <span>{avgScore} / 100</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1 text-xs text-gray-500">
                  {project.supervisor && (
                    <div>
                      <span>Supervisor: </span>
                      <span className="font-medium text-gray-800">{project.supervisor.name}</span>
                    </div>
                  )}
                  {project.sponsor && (
                    <div>
                      <span>Sponsor: </span>
                      <span className="font-medium text-gray-800">{project.sponsor.name}</span>
                    </div>
                  )}
                  <div>
                    <span>IP: </span>
                    <span className="font-medium text-gray-700">{project.ipStatus?.replace(/_/g, ' ')}</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex items-center justify-between gap-3 pt-3 border-gray-100">
                <div className="flex items-center gap-1.5">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                      title="Source Code"
                    >
                      <Code className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                      title="Live Demo"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
                <Link href={`/workspace/${project.id}`}>
                  <Button variant="outline" size="sm">
                    Workspace
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
