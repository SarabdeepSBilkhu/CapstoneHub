import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { MarketplaceClientFilter } from './marketplace-client';

export default async function MarketplacePage({ searchParams }) {
  const user = await getCurrentUser();
  const resolvedParams = await searchParams;
  const categoryFilter = resolvedParams.category;
  const searchQuery = resolvedParams.q;

  const where = {};
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

  const projects = await prisma.project.findMany({
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

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Project Marketplace</h1>
            <Badge variant="purple">Discovery</Badge>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Explore problem statements, apply as a student cohort, or propose capstone research.
          </p>
        </div>
        {user?.role === 'SPONSOR' && (
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="primary" size="sm">
                <PlusCircle className="w-4 h-4 mr-1.5" /> Post Problem Statement
              </Button>
            </Link>
          </div>
        )}
      </div>

      <MarketplaceClientFilter initialProjects={projects} currentUser={user} />
    </div>
  );
}
