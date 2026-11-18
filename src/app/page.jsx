import Link from 'next/link';
import { GraduationCap, FileCheck2, Users, ShieldCheck, Award, ArrowRight } from 'lucide-react';

const roles = [
  { icon: Users,        label: 'Students',         desc: 'Apply for projects, submit deliverables, track milestones.' },
  { icon: GraduationCap,label: 'Supervisors',       desc: 'Log meeting minutes, review deliverables, approve progress.' },
  { icon: FileCheck2,   label: 'Examiners',         desc: 'Score projects via rubric-based criteria with radar charts.' },
  { icon: ShieldCheck,  label: 'Industry Sponsors', desc: 'Post problem statements, monitor teams, manage IP.' },
  { icon: Award,        label: 'Administrators',    desc: 'Oversee cohorts, assign examiners, publish showcase.' },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="border-b border-gray-200 bg-white px-4 pt-20 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gray-200 text-xs text-gray-500 bg-gray-50">
            <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
            Capstone Project Management
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
            Manage your capstone<br />from start to finish
          </h1>
          <p className="text-base text-gray-500 max-w-xl mx-auto leading-relaxed">
            Connect student teams, industry sponsors, supervisors, and examiners in one unified platform.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors"
            >
              Get started <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/marketplace"
              className="inline-flex items-center px-5 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
            >
              Browse projects
            </Link>
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="mb-10 text-center">
          <h2 className="text-xl font-semibold text-gray-900">Five dedicated roles</h2>
          <p className="mt-1 text-sm text-gray-500">Each role has its own tailored workflow and permissions.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {roles.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="rounded-lg border border-gray-200 bg-white p-5 hover:border-indigo-200 hover:shadow-sm transition-all">
              <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-md bg-indigo-50 text-indigo-600">
                <Icon className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">{label}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stack */}
      <section className="border-t border-gray-200 bg-gray-50 py-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-4 font-medium">Technology Stack</p>
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-sm text-gray-500">
            {['Next.js App Router', 'React 19', 'Tailwind CSS', 'Prisma ORM', 'PostgreSQL', 'React Query', 'Zod', 'Railway'].map((t, i, arr) => (
              <span key={t} className="flex items-center gap-6">
                {t}
                {i < arr.length - 1 && <span className="text-gray-300">·</span>}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
