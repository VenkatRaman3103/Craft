import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

import * as schema from "../db/schema/index.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const { Pool } = pg;

// PostgreSQL connection
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });

pool.connect()
    .then(() => console.log("🟢 Connected to the db"))
    .catch((error) => console.error(`❌ Failed to connect: ${error}`));

// Example API query with nested relations
app.get("/api/get/pages", async (req, res) => {
    try {
        res.json("hello bigbird");
    } catch (error) {
        console.error("Query error:", error);
        res.status(500).json({
            error: `Internal server error: ${error.message}`,
        });
    }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🟢 Server is running on http://localhost:${PORT}`);
});
