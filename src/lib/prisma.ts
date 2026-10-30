import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // Only log in dev when a real local DB is configured; suppress expected Railway-only connection errors
    log: process.env.NODE_ENV === 'development' && process.env.DATABASE_URL?.includes('localhost')
      ? ['query', 'error', 'warn']
      : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;

