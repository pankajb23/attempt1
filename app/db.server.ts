import { PrismaClient } from "@prisma/client";
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg';
const { Pool } = pg;
const connectionString = `${process.env.DATABASE_URL}`
let adapter = new PrismaPg(new Pool({ connectionString }))

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
