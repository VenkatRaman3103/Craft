import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

import * as schema from "../db/schema/index.js";

dotenv.config();

export const app = express();
app.use(cors());
app.use(express.json());

const { Pool } = pg;

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });

export class Connection {
    constructor() {
        this.PORT = 5000;
    }

    server() {
        app.listen(this.PORT, () => {
            console.log(
                `🟢 Server is running on http://localhost:${this.PORT}`,
            );
        });
    }

    database() {
        pool.connect()
            .then(() => console.log("🟢 Connected to the db"))
            .catch((error) => console.error(`❌ Failed to connect: ${error}`));
    }
}
