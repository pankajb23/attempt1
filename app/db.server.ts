import { PrismaClient } from "@prisma/client";
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = `${process.env.DATABASE_URL}`

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)

declare global {
  var prisma: PrismaClient;
}

if (process.env.NODE_ENV !== "production") {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
}

const prisma: PrismaClient = global.prisma || new PrismaClient({adapter});

export default prisma;
