import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { users } from "../db/schema/user.js";
import { eq } from "drizzle-orm";
import { collectionsRouter } from "./collections/route.js";
import { collectionRouter } from "./collection/route.js";
import collectionJoinPageRouter from "./collectionJoinPageRouter/route.js";
import { blocksRouter } from "./blocks/route.js";
import { pagesRoute } from "./pages/route.js";
import * as schema from "../db/schema/index.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const { Pool } = pg;

// Set up PostgreSQL connection
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, {
    schema: schema,
});

// Connect to DB
pool.connect()
    .then(() => console.log("✓ Connected to the db"))
    .catch((error) => console.log(`Failed to connect: ${error}`));

// 🟢 Get all users
app.get("/api/users", async (req, res) => {
    try {
        const allUsers = await db.select().from(users);
        res.json(allUsers);
    } catch (error) {
        res.status(500).json({ error: `Internal server error ${error}` });
    }
});

// 🟢 Get user by email
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

// 🟢 Create user
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

// collections
app.use("/api", collectionsRouter);
app.use("/api", collectionRouter);
app.use("/api", collectionJoinPageRouter);

// pages
app.use("/api", pagesRoute);

// Update an existing page
// app.put("/api/pages/:id", async (req, res) => {
//     try {
//         const pageId = req.params.id;
//         const { title, slug } = req.body;
//
//         // Check if page exists
//         const existingPage = await db
//             .select()
//             .from(pages)
//             .where(eq(pages.page_id, pageId))
//             .limit(1);
//
//         if (existingPage.length === 0) {
//             return res.status(404).json({ error: "Page not found" });
//         }
//
//         // Update the page
//         const updatedPage = await db
//             .update(pages)
//             .set({
//                 title: title || existingPage[0].title,
//                 slug: slug || existingPage[0].slug,
//                 updated_at: new Date(),
//             })
//             .where(eq(pages.page_id, pageId))
//             .returning();
//
//         res.json(updatedPage[0]);
//     } catch (error) {
//         res.status(500).json({ error: `Internal server error: ${error}` });
//     }
// });

// Delete a page
// app.delete("/api/pages/:id", async (req, res) => {
//     try {
//         const pageId = req.params.id;
//
//         // Delete the page (cascade will delete blocks and field values)
//         await db.delete(pages).where(eq(pages.page_id, pageId));
//
//         res.status(204).send();
//     } catch (error) {
//         res.status(500).json({ error: `Internal server error: ${error}` });
//     }
// });

app.use("/api", blocksRouter);

app.get("/api/get/pages", async (req, res) => {
    try {
        const result = await db.query.pages.findMany({
            with: {
                page_items: {
                    with: {
                        field: true,
                        block: true,
                    },
                },
            },
        });
        res.json(result);
    } catch (error) {
        console.error("Query error:", error);
        res.status(500).json({
            error: `Internal server error: ${error.message}`,
        });
    }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`✓ Server is running on http://localhost:${PORT}`);
});
