import React from 'react';

export default function Loading() {
  return (
    <div className="flex min-h-[65vh] flex-col items-center justify-center space-y-4 px-4 text-center">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing pulsing ring */}
        <div className="absolute h-16 w-16 animate-ping rounded-full bg-indigo-500/20 duration-1000" />
        {/* Spinning gradient ring */}
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-indigo-500/20 border-t-indigo-500" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-zinc-200 tracking-wide animate-pulse">
          Loading view...
        </p>
        <p className="text-xs text-zinc-500">
          Syncing project state and roles
        </p>
      </div>
    </div>
  );
}
