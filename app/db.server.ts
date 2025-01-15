import { PrismaClient } from "@prisma/client";
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg';

const connectionString = `${process.env.DATABASE_URL}`

console.log(" connection String -> ",connectionString)
const adapter = new PrismaPg(new pg.Pool({ connectionString }))

declare global {
  var prisma: PrismaClient;
}

if (process.env.NODE_ENV !== "production") {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
}

const prisma: PrismaClient = global.prisma || new PrismaClient({
  log: ['query', 'warn', 'error']
});

export default prisma;
