import { PrismaClient } from '@prisma/client';

console.log('db.ts executed');

export const prisma = new PrismaClient();
// console.log(prisma);
