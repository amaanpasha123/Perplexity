import { PrismaClient } from "./prisma/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

export const prisma = new PrismaClient({
  adapter,
});
// now after attaching it with generator i can use this prisma variable to use for query as well


