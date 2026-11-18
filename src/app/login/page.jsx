'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/lib/validations';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useToast } from '@/context/toast-context';
import { GraduationCap, ShieldCheck, UserCheck, Briefcase, Award } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
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

      toast(`Welcome back, ${result.user.name}!`, 'success');
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      toast(err.message || 'Something went wrong', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (email) => {
    setValue('email', email);
    setValue('password', 'password123');
    toast(`Pre-filled credentials for ${email}`, 'info');
  };

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center p-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-1.5">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-2">
            <GraduationCap className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Sign in to CapstoneHub</h1>
          <p className="text-sm text-gray-500">
            Select a demo account below or enter your credentials
          </p>
        </div>

        <Card className="shadow-none border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle>Account login</CardTitle>
            <CardDescription>Enter your email and password</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Email"
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
                Sign in
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Fast-Switch */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Demo Persona Switcher
            </span>
            <span className="text-[11px] text-gray-400">1-click fill</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            <button
              onClick={() => handleQuickLogin('student@capstonehub.edu')}
              type="button"
              className="flex flex-col p-2.5 rounded-md bg-gray-50 hover:bg-gray-100 border border-gray-200 text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-1.5 text-indigo-600 font-medium mb-1">
                <UserCheck className="w-3.5 h-3.5" /> Student
              </div>
              <p className="font-medium text-gray-900 truncate">Alex</p>
              <p className="text-[10px] text-gray-500">Team Alpha</p>
            </button>

            <button
              onClick={() => handleQuickLogin('supervisor@capstonehub.edu')}
              type="button"
              className="flex flex-col p-2.5 rounded-md bg-gray-50 hover:bg-gray-100 border border-gray-200 text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-1.5 text-blue-600 font-medium mb-1">
                <GraduationCap className="w-3.5 h-3.5" /> Supervisor
              </div>
              <p className="font-medium text-gray-900 truncate">Dr. Martinez</p>
              <p className="text-[10px] text-gray-500">Meeting logs</p>
            </button>

            <button
              onClick={() => handleQuickLogin('examiner@capstonehub.edu')}
              type="button"
              className="flex flex-col p-2.5 rounded-md bg-gray-50 hover:bg-gray-100 border border-gray-200 text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-1.5 text-emerald-600 font-medium mb-1">
                <Award className="w-3.5 h-3.5" /> Examiner
              </div>
              <p className="font-medium text-gray-900 truncate">Prof. Jenkins</p>
              <p className="text-[10px] text-gray-500">Grading rubric</p>
            </button>

            <button
              onClick={() => handleQuickLogin('sponsor@novalabs.io')}
              type="button"
              className="flex flex-col p-2.5 rounded-md bg-gray-50 hover:bg-gray-100 border border-gray-200 text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-1.5 text-amber-600 font-medium mb-1">
                <Briefcase className="w-3.5 h-3.5" /> Sponsor
              </div>
              <p className="font-medium text-gray-900 truncate">Elena Rostova</p>
              <p className="text-[10px] text-gray-500">Steerpath</p>
            </button>

            <button
              onClick={() => handleQuickLogin('admin@capstonehub.edu')}
              type="button"
              className="flex flex-col p-2.5 rounded-md bg-gray-50 hover:bg-gray-100 border border-gray-200 text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-1.5 text-rose-600 font-medium mb-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Admin
              </div>
              <p className="font-medium text-gray-900 truncate">Dean Wright</p>
              <p className="text-[10px] text-gray-500">Cohort admin</p>
            </button>

            <button
              onClick={() => handleQuickLogin('examiner2@capstonehub.edu')}
              type="button"
              className="flex flex-col p-2.5 rounded-md bg-gray-50 hover:bg-gray-100 border border-gray-200 text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-1.5 text-teal-600 font-medium mb-1">
                <Award className="w-3.5 h-3.5" /> Examiner 2
              </div>
              <p className="font-medium text-gray-900 truncate">Dr. Vivek Sharma</p>
              <p className="text-[10px] text-gray-500">Viva panel</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
