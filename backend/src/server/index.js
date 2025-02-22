import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { users } from "../db/schema/user.js";
import { eq } from "drizzle-orm";
import { collections } from "../db/schema/collection.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const { Pool } = pg;

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool);

pool.connect()
    .then(() => console.log("✓ Connected to the db"))
    .catch((error) => console.log(`Failed to connect: ${error}`));

app.get("/api/users", async (req, res) => {
    try {
        const allUsers = await db.select().from(users);
        res.json(allUsers);
    } catch (error) {
        res.status(500).json({ error: `Internal server error ${error}` });
    }
});

app.get("/api/user/:email", async (req, res) => {
    try {
        const user = await db
            .select()
            .from(users)
            .where(eq(users.email, req.params.email));
        res.json(user.length ? user[0] : { message: "User not found" });
    } catch (error) {
        res.status(500).json({ error: `Internal server error ${error}` });
    }
});

app.post("/api/users", async (req, res) => {
    const { name, email } = req.body;
    try {
        const newUser = await db
            .insert(users)
            .values({ name, email })
            .returning();
        res.status(201).json(newUser[0]);
    } catch (error) {
        res.status(500).json({ error: `Internal server error ${error}` });
    }
});

app.get("/api/collections", async (req, res) => {
    try {
        const allCollections = await db.select().from(collections);
        res.json(allCollections);
    } catch (error) {
        console.error("Error fetching collections:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/api/collections", async (req, res) => {
    try {
        const { name, status, slug } = req.body;

        const response = await db
            .insert(collections)
            .values({ name, status, slug })
            .returning();

        console.log("Inserted Data:", response);
        res.status(201).json(response[0]);
    } catch (error) {
        console.error("Database insert error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`✓ Server is running on http://localhost:${PORT}`);
});
