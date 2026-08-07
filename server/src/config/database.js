// A single shared Prisma Client instance.
// Why a singleton: every `new PrismaClient()` opens its own connection pool.
// In dev, nodemon reloads this module often — reusing one instance avoids
// exhausting SQLite's connection limit and speeds up hot reloads.

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
});

module.exports = prisma;
