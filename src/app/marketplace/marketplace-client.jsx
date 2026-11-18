'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
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
  ArrowRight,
  Send,
} from 'lucide-react';

export function MarketplaceClientFilter({ initialProjects, currentUser }) {
  const { toast } = useToast();
  const [projects, setProjects] = useState(initialProjects);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [bookmarkedIds, setBookmarkedIds] = useState([]);

  // Applying modal / form state
  const [applyingProjectId, setApplyingProjectId] = useState(null);
  const [teamName, setTeamName] = useState('GeoPath Innovators (Team Alpha)');
  const [proposal, setProposal] = useState(
    'Our team has strong experience building graph routing algorithms with Next.js, PostgreSQL, and Leaflet Maps API. We propose full multi-floor SVG navigation.'
  );
  const [isApplying, setIsApplying] = useState(false);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchCat = selectedCategory === 'ALL' || p.category === selectedCategory;
      const q = searchTerm.toLowerCase();
      const matchQuery =
        !searchTerm ||
        p.title.toLowerCase().includes(q) ||
        p.problemStatement.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      return matchCat && matchQuery;
    });
  }, [projects, selectedCategory, searchTerm]);

  const toggleBookmark = (id) => {
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds((prev) => prev.filter((i) => i !== id));
      toast('Removed from bookmarks', 'info');
    } else {
      setBookmarkedIds((prev) => [...prev, id]);
      toast('Project bookmarked', 'success');
    }
  };

  const handleApply = async (projectId) => {
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
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
          {[
            { id: 'ALL', label: 'All' },
            { id: 'INDUSTRY_SPONSORED', label: 'Industry' },
            { id: 'ACADEMIC_RESEARCH', label: 'Research' },
            { id: 'ENTREPRENEURSHIP_CAPSTONE', label: 'Entrepreneurship' },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setSelectedCategory(id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                selectedCategory === id
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProjects.map((project) => {
          const isBookmarked = bookmarkedIds.includes(project.id);
          const hasTeam = Boolean(project.allocatedTeamId || project.allocatedTeam);
          const isOpen = !hasTeam || project.status === 'APPROVED';

          return (
            <Card
              key={project.id}
              className="flex flex-col justify-between hover:border-gray-300 transition-all border-gray-200 shadow-none"
            >
              <CardHeader className="space-y-2 pb-3">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant={project.category === 'INDUSTRY_SPONSORED' ? 'warning' : 'info'}>
                    {project.category.replace(/_/g, ' ')}
                  </Badge>
                  <button
                    onClick={() => toggleBookmark(project.id)}
                    className="p-1 rounded text-gray-400 hover:text-amber-500 transition-colors cursor-pointer"
                    title={isBookmarked ? 'Remove Bookmark' : 'Bookmark'}
                  >
                    {isBookmarked ? (
                      <BookmarkCheck className="w-4 h-4 text-amber-500" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <Link href={`/workspace/${project.id}`} className="group">
                  <CardTitle className="text-base font-semibold group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {project.title}
                  </CardTitle>
                </Link>

                <CardDescription className="line-clamp-2 text-xs text-gray-500">
                  {project.problemStatement}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Skills */}
                <div className="flex flex-wrap gap-1">
                  {project.requiredSkills?.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded bg-gray-100 text-[11px] text-gray-600"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Details */}
                <div className="border-t border-gray-100 pt-3 space-y-1.5 text-xs text-gray-500">
                  {project.sponsor && (
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-gray-400" /> Sponsor
                      </span>
                      <span className="font-medium text-gray-800">{project.sponsor.name}</span>
                    </div>
                  )}
                  {project.supervisor && (
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-gray-400" /> Supervisor
                      </span>
                      <span className="font-medium text-gray-800">{project.supervisor.name}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-gray-400" /> Status
                    </span>
                    <Badge variant={isOpen ? 'success' : 'default'}>
                      {isOpen ? 'Open' : 'Allocated'}
                    </Badge>
                  </div>
                </div>
              </CardContent>

              <div className="px-5 pb-5 pt-2 flex items-center gap-2">
                <Link href={`/workspace/${project.id}`} className="w-full">
                  <Button variant="outline" size="sm" className="w-full">
                    Workspace <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </Link>

                {(!currentUser || currentUser.role === 'STUDENT') && (
                  <Button
                    variant={hasTeam ? 'secondary' : 'primary'}
                    size="sm"
                    className="w-full"
                    onClick={() => setApplyingProjectId(project.id)}
                  >
                    {hasTeam ? 'Apply Anyway' : 'Apply'}
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Application Modal */}
      {applyingProjectId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-w-md w-full bg-white rounded-lg border border-gray-200 p-6 space-y-4 shadow-lg">
            <div>
              <h3 className="text-base font-semibold text-gray-900">Submit Cohort Application</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Outline your team name and proposed technical approach
              </p>
            </div>
            <div className="space-y-3 text-xs">
              <Input
                label="Team Name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Proposed Solution
                </label>
                <textarea
                  rows={4}
                  value={proposal}
                  onChange={(e) => setProposal(e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <Button variant="ghost" size="sm" onClick={() => setApplyingProjectId(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                isLoading={isApplying}
                onClick={() => handleApply(applyingProjectId)}
              >
                <Send className="w-3.5 h-3.5 mr-1.5" /> Submit Application
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
