'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  GraduationCap,
  LayoutDashboard,
  Store,
  FileCheck2,
  Users,
  Eye,
  LogOut,
} from 'lucide-react';
import { useToast } from '@/context/toast-context';
import { Button } from './ui/button';

interface NavbarProps {
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
}

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      // Clear cookie client-side as well to ensure immediate sync
      document.cookie = 'capstone_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0';
      toast('Logged out successfully', 'info');
      router.push('/login');
      router.refresh();
    } catch {
      toast('Failed to logout', 'error');
    }
  };

  const navLinks = [
    ...(user ? [{ href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }] : []),
    { href: '/marketplace', label: 'Project Market', icon: Store },
    { href: '/showcase', label: 'Showcase', icon: Eye },
    ...(user?.role === 'SUPERVISOR' || user?.role === 'EXAMINER' || user?.role === 'ADMIN'
      ? [{ href: '/evaluation', label: 'Rubrics & Grading', icon: FileCheck2 }]
      : []),
    ...(user?.role === 'ADMIN' ? [{ href: '/admin', label: 'Administration', icon: Users }] : []),
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 group-hover:scale-105 transition-transform">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <span className="font-bold text-lg text-white tracking-tight">Capstone<span className="text-indigo-400">Hub</span></span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-zinc-800 text-white font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-sm font-medium text-white">{user.name}</span>
                <span className="text-[11px] font-medium text-indigo-400 uppercase tracking-wider">{user.role}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-zinc-400 hover:text-rose-400">
                <LogOut className="w-4 h-4 mr-1.5" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm">Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
