import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { mockDb } from '@/lib/mock-db';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Store, PlusCircle, Search, ExternalLink, Users, Building, ShieldCheck } from 'lucide-react';
import { MarketplaceClientFilter } from './marketplace-client';

interface MarketplaceProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function MarketplacePage({ searchParams }: MarketplaceProps) {
  const resolvedParams = await searchParams;
  const categoryFilter = resolvedParams.category;
  const searchQuery = resolvedParams.q;

  let projects: any[] = [];

  try {
    const where: any = {};
    if (categoryFilter && categoryFilter !== 'ALL') {
      where.category = categoryFilter;
    }
    if (searchQuery) {
      where.OR = [
        { title: { contains: searchQuery, mode: 'insensitive' } },
        { description: { contains: searchQuery, mode: 'insensitive' } },
        { problemStatement: { contains: searchQuery, mode: 'insensitive' } },
      ];
    }

    projects = await prisma.project.findMany({
      where,
      include: {
        sponsor: true,
        supervisor: true,
        allocatedTeam: {
          include: { members: true },
        },
        applications: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  } catch {
    // fallback
  }

  if (projects.length === 0) {
    await mockDb.init();
    projects = mockDb.projects.filter((p) => {
      if (categoryFilter && categoryFilter !== 'ALL' && p.category !== categoryFilter) return false;
      return true;
    });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-white">Project Marketplace</h1>
            <Badge variant="purple">Discovery & Applications</Badge>
          </div>
          <p className="mt-1 text-sm text-zinc-400">
            Explore industry-sponsored problem statements, apply as an engineering cohort, or propose novel capstone research.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="primary" size="sm">
              <PlusCircle className="w-4 h-4 mr-1.5" /> Post Sponsor Problem
            </Button>
          </Link>
        </div>
      </div>

      <MarketplaceClientFilter initialProjects={projects} />
    </div>
  );
}
