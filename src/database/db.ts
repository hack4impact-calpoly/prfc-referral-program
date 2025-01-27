import { PrismaClient } from "@prisma/client";

// Prisma Client automatically manages the database connection for you.
const prisma = new PrismaClient();

export default prisma;
