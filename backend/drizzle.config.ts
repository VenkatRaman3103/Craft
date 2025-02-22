import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "./src/db/schema",
    out: "./drizzle",
    dialect: "postgresql", // ✅ Required for PostgreSQL
    dbCredentials: {
        connectionString: process.env.DATABASE_URL ?? "",
    },
});
