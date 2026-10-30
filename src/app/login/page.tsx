'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginInput } from '@/lib/validations';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/context/toast-context';
import { GraduationCap, ShieldCheck, UserCheck, Briefcase, Sparkles, Award } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Failed to login');
      }

      toast(`Welcome back, ${result.user.name}! (${result.user.role})`, 'success');
      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      toast(err.message || 'Something went wrong', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (email: string) => {
    setValue('email', email);
    setValue('password', 'password123');
    toast(`Pre-filled credentials for ${email}`, 'info');
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 py-12">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 mb-2">
            <GraduationCap className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Sign In to CapstoneHub</h1>
          <p className="text-sm text-zinc-400">
            End-to-end Project Lifecycle: &ldquo;Smart Campus Navigation System&rdquo;
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Account Credentials</CardTitle>
            <CardDescription>Enter registered email and password</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="name@capstonehub.edu"
                error={errors.email?.message}
                {...register('email')}
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password')}
              />

              <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
                Sign In to Dashboard
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* 1-Click Persona Fast-Switch for 15-Minute Demonstration */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Live Demo Persona Switcher
            </span>
            <span className="text-[10px] text-zinc-500">Auto-fills credentials</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            {/* Step 1: Sponsor */}
            <button
              onClick={() => handleQuickLogin('sponsor@novalabs.io')}
              type="button"
              className="flex flex-col p-2.5 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/60 text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-1 text-amber-400 font-semibold mb-1">
                <Briefcase className="w-3.5 h-3.5" /> Sponsor
              </div>
              <p className="font-medium text-white truncate">Elena (Steerpath)</p>
              <p className="text-[10px] text-zinc-400">Post Problem & NDA</p>
            </button>

            {/* Step 2: Admin */}
            <button
              onClick={() => handleQuickLogin('admin@capstonehub.edu')}
              type="button"
              className="flex flex-col p-2.5 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/60 text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-1 text-rose-400 font-semibold mb-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Admin
              </div>
              <p className="font-medium text-white truncate">Dean Arthur Wright</p>
              <p className="text-[10px] text-zinc-400">Approval & Allocations</p>
            </button>

            {/* Step 3: Student */}
            <button
              onClick={() => handleQuickLogin('student@capstonehub.edu')}
              type="button"
              className="flex flex-col p-2.5 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/60 text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-1 text-purple-400 font-semibold mb-1">
                <UserCheck className="w-3.5 h-3.5" /> Student
              </div>
              <p className="font-medium text-white truncate">Alex (Team Alpha)</p>
              <p className="text-[10px] text-zinc-400">Submit Deliverables</p>
            </button>

            {/* Step 6 & 7: Supervisor */}
            <button
              onClick={() => handleQuickLogin('supervisor@capstonehub.edu')}
              type="button"
              className="flex flex-col p-2.5 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/60 text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-1 text-sky-400 font-semibold mb-1">
                <GraduationCap className="w-3.5 h-3.5" /> Supervisor
              </div>
              <p className="font-medium text-white truncate">Dr. Martinez</p>
              <p className="text-[10px] text-zinc-400">Review & Meeting Logs</p>
            </button>

            {/* Step 8: Examiner */}
            <button
              onClick={() => handleQuickLogin('examiner@capstonehub.edu')}
              type="button"
              className="flex flex-col p-2.5 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/60 text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-1 text-emerald-400 font-semibold mb-1">
                <Award className="w-3.5 h-3.5" /> Examiner 1
              </div>
              <p className="font-medium text-white truncate">Prof. Jenkins</p>
              <p className="text-[10px] text-zinc-400">6-Criteria Rubric</p>
            </button>

            {/* Step 8: Examiner 2 */}
            <button
              onClick={() => handleQuickLogin('examiner2@capstonehub.edu')}
              type="button"
              className="flex flex-col p-2.5 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/60 text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-1 text-emerald-400 font-semibold mb-1">
                <Award className="w-3.5 h-3.5" /> Examiner 2
              </div>
              <p className="font-medium text-white truncate">Dr. Vivek Sharma</p>
              <p className="text-[10px] text-zinc-400">Independent Viva</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
