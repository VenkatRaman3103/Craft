import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../db/schema/index.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

class Connection {
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

export { app, pool, db, Connection };
