import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {
  GraduationCap,
  Store,
  FileCheck2,
  Users,
  ShieldCheck,
  Award,
  ArrowRight,
  Database,
  Layers,
  Sparkles,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-20 pb-16 sm:px-6 lg:px-8 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.15),rgba(255,255,255,0))]">
        <div className="mx-auto max-w-5xl text-center space-y-6">
          <Badge variant="purple" className="px-4 py-1.5 text-xs font-semibold gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            5th Semester B.Tech CSE Course Project
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Final-Year Capstone & Industry Project <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-sky-400">
              Management Platform
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-zinc-400 leading-relaxed">
            Eliminate chaotic project allocation, opaque faculty supervision, and subjective grading. CapstoneHub
            connects student teams, industry sponsors, supervisors, and external examiners in a unified, rubric-driven
            ecosystem.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href="/login">
              <Button size="lg" className="px-6 font-semibold shadow-lg shadow-indigo-600/20">
                Explore Platform <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
            <Link href="/marketplace">
              <Button variant="outline" size="lg" className="px-6">
                Browse Problem Statements
              </Button>
            </Link>
            <Link href="/showcase">
              <Button variant="secondary" size="lg" className="px-6">
                Public Showcase
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 5 Core Stakeholder Personas */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            End-to-End Governance Across 5 Dedicated Roles
          </h2>
          <p className="text-sm text-zinc-400">Designed precisely to address the core requirements in the course curriculum.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <Card className="hover:border-indigo-500/50 transition-colors">
            <CardHeader className="pb-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-2">
                <Users className="w-5 h-5" />
              </div>
              <CardTitle className="text-base">Students</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-zinc-400">
              Form multi-disciplinary teams, apply for problem statements, upload versioned deliverables, and check similarity scores.
            </CardContent>
          </Card>

          <Card className="hover:border-sky-500/50 transition-colors">
            <CardHeader className="pb-3">
              <div className="h-10 w-10 rounded-xl bg-sky-600/20 text-sky-400 flex items-center justify-center mb-2">
                <GraduationCap className="w-5 h-5" />
              </div>
              <CardTitle className="text-base">Supervisors</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-zinc-400">
              Weekly meeting minutes, action-item tracking, deliverable review cycles, and approval gatekeeping.
            </CardContent>
          </Card>

          <Card className="hover:border-purple-500/50 transition-colors">
            <CardHeader className="pb-3">
              <div className="h-10 w-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center mb-2">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <CardTitle className="text-base">Examiners</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-zinc-400">
              Criteria-based 5-part rubric scoring (problem, methodology, implementation, originality, viva) with radar visualizers.
            </CardContent>
          </Card>

          <Card className="hover:border-amber-500/50 transition-colors">
            <CardHeader className="pb-3">
              <div className="h-10 w-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center mb-2">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <CardTitle className="text-base">Industry Sponsors</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-zinc-400">
              Publish enterprise challenge statements, monitor milestones, manage NDA agreements, and assert intellectual property.
            </CardContent>
          </Card>

          <Card className="hover:border-emerald-500/50 transition-colors">
            <CardHeader className="pb-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-2">
                <Award className="w-5 h-5" />
              </div>
              <CardTitle className="text-base">Administrators</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-zinc-400">
              Cohort-wide analytics, examiner assignment, deadline scheduling, and public showcase approval for accreditation.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Tech Stack Banner */}
      <section className="border-t border-zinc-900 bg-zinc-950/50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
            Technology Stack & Curriculum Competencies
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm font-medium text-zinc-400">
            <span>Next.js App Router</span>
            <span>•</span>
            <span>React 19 & TypeScript</span>
            <span>•</span>
            <span>Tailwind CSS</span>
            <span>•</span>
            <span>Prisma ORM & PostgreSQL</span>
            <span>•</span>
            <span>React Query</span>
            <span>•</span>
            <span>Zod & React Hook Form</span>
            <span>•</span>
            <span>Zustand</span>
            <span>•</span>
            <span>Recharts</span>
            <span>•</span>
            <span>Railway Cloud Ready</span>
          </div>
        </div>
      </section>
    </div>
  );
}
