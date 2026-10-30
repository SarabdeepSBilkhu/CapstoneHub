import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/providers';
import { ToastProvider } from '@/context/toast-context';
import { Navbar } from '@/components/navbar';
import { getCurrentUser } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'CapstoneHub | Capstone & Industry Project Management Platform',
  description:
    'Full-stack platform for final-year and industry capstone project lifecycle: problem statements, sponsorship, team formation, supervisor logs, rubric-based multi-examiner evaluation, and public showcase.',
  keywords: ['Capstone', 'Engineering', 'Project Management', 'Next.js', 'React', 'Prisma', 'Evaluation Rubric'],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased selection:bg-indigo-500 selection:text-white font-sans">
        <Providers>
          <ToastProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar user={user} />
              <main className="flex-1">{children}</main>
              <footer className="border-t border-zinc-900 py-8 text-center text-xs text-zinc-500">
                <p>CapstoneHub — 5th Semester B.Tech CSE Course Project</p>
                <p className="mt-1">Built with ReactJS, Next.js App Router, Tailwind CSS, Prisma ORM & PostgreSQL</p>
              </footer>
            </div>
          </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}
