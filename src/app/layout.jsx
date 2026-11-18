import './globals.css';
import Providers from '@/components/providers';
import { ToastProvider } from '@/context/toast-context';
import { Navbar } from '@/components/navbar';
import { getCurrentUser } from '@/lib/auth';
import { NavigationProgressBar } from '@/components/navigation-progress-bar';
import { Suspense } from 'react';

export const metadata = {
  title: 'CapstoneHub | Capstone Project Management',
  description:
    'Full-stack platform for final-year and industry capstone project lifecycle management.',
};

export default async function RootLayout({ children }) {
  const user = await getCurrentUser();

  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900 antialiased font-sans">
        <Providers>
          <ToastProvider>
            <Suspense fallback={null}>
              <NavigationProgressBar />
            </Suspense>
            <div className="flex min-h-screen flex-col">
              <Navbar user={user} />
              <main className="flex-1 bg-gray-50">
                {children}
              </main>
              <footer className="border-t border-gray-200 bg-white py-6 text-center text-xs text-gray-400">
                <p className="font-medium text-gray-500">CapstoneHub</p>
                <p className="mt-0.5">Built with Next.js · Prisma · PostgreSQL · Tailwind CSS</p>
              </footer>
            </div>
          </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}
