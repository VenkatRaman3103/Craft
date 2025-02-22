import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "./src/schema.ts",
    out: "./drizzle",
    dialect: "postgresql", // ✅ Required for PostgreSQL
    dbCredentials: {
        connectionString: process.env.DATABASE_URL ?? "",
    },
});
