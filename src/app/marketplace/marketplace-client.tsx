'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/context/toast-context';
import {
  Search,
  Building,
  ShieldCheck,
  Users,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  ArrowRight,
  Send,
} from 'lucide-react';

interface Props {
  initialProjects: any[];
}

export function MarketplaceClientFilter({ initialProjects }: Props) {
  const { toast } = useToast();
  const [projects, setProjects] = useState(initialProjects);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  // Applying modal / form state
  const [applyingProjectId, setApplyingProjectId] = useState<string | null>(null);
  const [teamName, setTeamName] = useState('GeoPath Innovators (Team Alpha)');
  const [proposal, setProposal] = useState(
    'Our team has strong experience building graph routing algorithms with Next.js, PostgreSQL, and Leaflet Maps API. We propose full multi-floor SVG navigation.'
  );
  const [isApplying, setIsApplying] = useState(false);

  // Derived filtered state using useMemo (Syllabus Unit III React)
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchCat = selectedCategory === 'ALL' || p.category === selectedCategory;
      const q = searchTerm.toLowerCase();
      const matchQuery =
        !searchTerm ||
        p.title.toLowerCase().includes(q) ||
        p.problemStatement.toLowerCase().includes(q) ||
        p.tags.some((t: string) => t.toLowerCase().includes(q));
      return matchCat && matchQuery;
    });
  }, [projects, selectedCategory, searchTerm]);

  const toggleBookmark = (id: string) => {
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds((prev) => prev.filter((i) => i !== id));
      toast('Project removed from bookmarks', 'info');
    } else {
      setBookmarkedIds((prev) => [...prev, id]);
      toast('Project bookmarked for application!', 'success');
    }
  };

  const handleApply = async (projectId: string) => {
    setIsApplying(true);
    try {
      const res = await fetch('/api/projects/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, teamName, proposal }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit application');

      toast(data.message || 'Application submitted successfully!', 'success');
      setApplyingProjectId(null);
    } catch (err: any) {
      toast(err.message, 'error');
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Bar & Category Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search keywords, indoor navigation, maps..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-zinc-950/70"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
          {['ALL', 'INDUSTRY_SPONSORED', 'ACADEMIC_RESEARCH', 'ENTREPRENEURSHIP_CAPSTONE'].map((cat) => (
            <Button
              key={cat}
              size="sm"
              variant={selectedCategory === cat ? 'primary' : 'outline'}
              onClick={() => setSelectedCategory(cat)}
              className="text-xs whitespace-nowrap"
            >
              {cat === 'ALL' ? 'All Statements' : cat.replace('_', ' ')}
            </Button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => {
          const isBookmarked = bookmarkedIds.includes(project.id);
          const hasTeam = Boolean(project.allocatedTeamId || project.allocatedTeam);

          return (
            <Card key={project.id} className="flex flex-col justify-between hover:border-zinc-700 transition-all">
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant={project.category === 'INDUSTRY_SPONSORED' ? 'warning' : 'info'}>
                    {project.category.replace('_', ' ')}
                  </Badge>
                  <button
                    onClick={() => toggleBookmark(project.id)}
                    className="p-1 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-amber-400 transition-colors"
                    title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Problem'}
                  >
                    {isBookmarked ? (
                      <BookmarkCheck className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <Link href={`/workspace/${project.id}`} className="group">
                  <CardTitle className="text-base line-clamp-2 leading-snug group-hover:text-indigo-400 transition-colors">
                    {project.title}
                  </CardTitle>
                </Link>

                <CardDescription className="line-clamp-3 text-xs leading-relaxed">
                  {project.problemStatement}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Required Skills & Technologies */}
                <div className="flex flex-wrap gap-1.5">
                  {project.requiredSkills?.map((skill: string) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded-md bg-zinc-800 text-[11px] text-zinc-300 font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Stakeholder Details */}
                <div className="border-t border-zinc-800/80 pt-3 space-y-2 text-xs text-zinc-400">
                  {project.sponsor && (
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-amber-400" /> Sponsor
                      </span>
                      <span className="font-medium text-white">{project.sponsor.name}</span>
                    </div>
                  )}
                  {project.supervisor && (
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-sky-400" /> Supervisor
                      </span>
                      <span className="font-medium text-white">{project.supervisor.name}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-zinc-400" /> Status
                    </span>
                    <Badge variant={hasTeam ? 'purple' : 'success'}>
                      {hasTeam ? 'Team Allocated' : 'Open for Cohort Applications'}
                    </Badge>
                  </div>
                </div>
              </CardContent>

              <div className="p-6 pt-3 flex items-center gap-2">
                <Link href={`/workspace/${project.id}`} className="w-full">
                  <Button variant="outline" size="sm" className="w-full">
                    Open Workspace <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>

                {!hasTeam && (
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    onClick={() => setApplyingProjectId(project.id)}
                  >
                    Apply as Cohort
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Application Modal (Step 3 & 4) */}
      {applyingProjectId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <Card className="max-w-lg w-full bg-zinc-900 border-zinc-700 space-y-4">
            <CardHeader>
              <CardTitle>Submit Cohort Application</CardTitle>
              <CardDescription>
                Demonstrate team qualification, prior work, and proposed architecture
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <Input
                label="Registered Team Name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
              />
              <div>
                <label className="block text-[11px] font-semibold uppercase text-zinc-300 mb-1">
                  Proposed Solution & Technical Fit
                </label>
                <textarea
                  rows={4}
                  value={proposal}
                  onChange={(e) => setProposal(e.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-950 p-2.5 text-zinc-200"
                />
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setApplyingProjectId(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                isLoading={isApplying}
                onClick={() => handleApply(applyingProjectId)}
              >
                <Send className="w-3.5 h-3.5 mr-1.5" /> Submit to Review Committee
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}

