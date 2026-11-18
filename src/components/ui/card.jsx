import React from 'react';
import { cn } from '@/lib/utils';

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn('rounded-lg border border-gray-200 bg-white p-5 transition-all', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }) {
  return <div className={cn('flex flex-col space-y-1 pb-4', className)} {...props}>{children}</div>;
}

export function CardTitle({ className, children, ...props }) {
  return <h3 className={cn('text-base font-semibold text-gray-900 leading-snug', className)} {...props}>{children}</h3>;
}

export function CardDescription({ className, children, ...props }) {
  return <p className={cn('text-sm text-gray-500', className)} {...props}>{children}</p>;
}

export function CardContent({ className, children, ...props }) {
  return <div className={cn('pt-0', className)} {...props}>{children}</div>;
}

export function CardFooter({ className, children, ...props }) {
  return <div className={cn('flex items-center pt-4 border-t border-gray-100', className)} {...props}>{children}</div>;
}
