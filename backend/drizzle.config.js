import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
    schema: "./src/db/schema/*",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        url: "postgresql://postgres:3103@localhost:5432/craft",
    },
});
