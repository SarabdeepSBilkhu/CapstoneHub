import '@testing-library/jest-dom';
import { vi } from 'vitest';

// ─── Mock next/headers (cookies) ─────────────────────────────────────────────
vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    get: vi.fn(() => null),
    set: vi.fn(),
    delete: vi.fn(),
  })),
}));

// ─── Mock next/server ─────────────────────────────────────────────────────────
vi.mock('next/server', async () => {
  const actual = await vi.importActual('next/server');
  return {
    ...actual,
    NextResponse: {
      json: (body, init) => ({
        ok: (init?.status ?? 200) < 400,
        status: init?.status ?? 200,
        json: async () => body,
        body,
      }),
    },
  };
});

// ─── Mock Prisma ──────────────────────────────────────────────────────────────
vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    project: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    projectApplication: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
    },
    milestone: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    supervisorLog: {
      create: vi.fn(),
    },
    team: {
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    evaluation: {
      findMany: vi.fn(),
      upsert: vi.fn(),
    },
    $transaction: vi.fn((fn) => fn()),
  },
}));

// ─── Mock next/navigation ────────────────────────────────────────────────────
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }),
  useSearchParams: () => ({ get: vi.fn(() => null) }),
  usePathname: () => '/',
}));

// ─── Silence console.error in tests ─────────────────────────────────────────
beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => {
  vi.restoreAllMocks();
});
