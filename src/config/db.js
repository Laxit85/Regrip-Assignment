import { PrismaClient } from '@prisma/client';

// Prisma singleton pattern to avoid multiple instances in development
const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
