import { PrismaClient } from "@prisma/client";
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = `${process.env.DATABASE_URL}`


let adapter = null;
await (async () => {
  const pg = await import('pg');
  const { Pool } = pg.default;
  adapter = new PrismaPg(new Pool({ connectionString }))
})();

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
