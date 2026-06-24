// import { PrismaClient } from "./generated/prisma/client";
// import { PrismaPg } from "@prisma/adapter-pg";

// const adapter = new PrismaPg({
//   connectionString: process.env.DATABASE_URL!,
// });

// export const prisma = new PrismaClient({
//   adapter,
// });


// node -e "const net = require('net'); const s = net.createConnection(5432, 'db.kcluylwzdahvicapbzgb.supabase.co'); s.on('connect', () => { console.log('CONNECTED'); s.end(); }); s.on('error', (e) => console.log('ERROR:', e.message));"


import { PrismaClient } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from 'dotenv';

// Load environment variables before doing anything else
dotenv.config({
    path: './.env'
});

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_URL!,
});

console.log('DIRECT_URL being used:', JSON.stringify(process.env.DIRECT_URL)); adapter.connect?.().then(() => console.log('Adapter connected OK')).catch((e: any) => console.log('Adapter connect error:', e));



export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}