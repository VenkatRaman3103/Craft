import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

pool.connect()
    .then(() => console.log("✓ Connected to the db"))
    .catch((error) =>
        console.log(`failded to make connection to the db: ${error}`),
    );

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`✓ Server is running on http://localhost:${PORT}`);
});
