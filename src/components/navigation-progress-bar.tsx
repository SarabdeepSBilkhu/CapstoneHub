'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function NavigationProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // When URL or query parameters change, finish loading animation
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 350);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-[3px] w-full bg-zinc-900/40 overflow-hidden backdrop-blur-sm">
      <div className="h-full w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-400 animate-route-progress shadow-[0_0_12px_rgba(99,102,241,0.8)]" />
    </div>
  );
}
