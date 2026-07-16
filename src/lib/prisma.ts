import { PrismaClient, Prisma } from '@/generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({ adapter } as Prisma.PrismaClientOptions);
}

const globalForPrisma = globalThis as unknown as { _prisma?: PrismaClient };
export const prisma: PrismaClient = globalForPrisma._prisma ?? (globalForPrisma._prisma = createPrismaClient());
