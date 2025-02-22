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

// requests and responses
app.get("/api/users", async (req, res) => {
    try {
        const response = await pool.query(`SELECT * FROM users;`);
        res.json(response.rows);
    } catch (error) {
        res.status(500).json({ error: `Internal server error ${error}` });
    }
});

app.get("/api/test", (req, res) => {
    res.json("Hello world");
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`✓ Server is running on http://localhost:${PORT}`);
});
