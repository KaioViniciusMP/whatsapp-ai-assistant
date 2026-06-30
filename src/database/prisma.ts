import { PrismaClient } from "../generated/prisma/index.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { env } from "../config/env.js";

const adapter = new PrismaBetterSqlite3({ url: env.databaseUrl });

export const prisma = new PrismaClient({ adapter });