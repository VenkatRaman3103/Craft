import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { users } from "../db/schema/user.js";
import { eq } from "drizzle-orm";
import { collectionsRouter } from "./collections/route.js";
import { collectionRouter } from "./collection/route.js";
import {
    blocks,
    blockTypes,
    fieldDefinitions,
    fieldValues,
    pages,
} from "../db/schema/pages.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const { Pool } = pg;

// Set up PostgreSQL connection
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool);

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

app.use("/api", collectionsRouter);
app.use("/api", collectionRouter);
// Assuming you're using Express.js

// Get all pages
app.get("/api/pages", async (req, res) => {
    try {
        const allPages = await db.select().from(pages);
        res.json(allPages);
    } catch (error) {
        res.status(500).json({ error: `Internal server error: ${error}` });
    }
});

// Get a specific page with all its content
app.get("/api/pages/:id", async (req, res) => {
    try {
        const pageId = req.params.id;

        // Get the page
        const page = await db
            .select()
            .from(pages)
            .where(eq(pages.page_id, pageId))
            .limit(1);

        if (page.length === 0) {
            return res.status(404).json({ error: "Page not found" });
        }

        // Get all blocks for this page
        const pageBlocks = await db
            .select({
                block_id: blocks.block_id,
                order: blocks.order,
                block_type_id: blocks.block_type_id,
                block_type_name: blockTypes.name,
            })
            .from(blocks)
            .innerJoin(
                blockTypes,
                eq(blocks.block_type_id, blockTypes.block_type_id),
            )
            .where(eq(blocks.page_id, pageId))
            .orderBy(blocks.order);

        // For each block, get its fields and values
        const blocksWithContent = [];

        for (const block of pageBlocks) {
            // Get field definitions for this block type
            const fieldDefs = await db
                .select()
                .from(fieldDefinitions)
                .where(eq(fieldDefinitions.block_type_id, block.block_type_id))
                .orderBy(fieldDefinitions.order);

            // Get field values for this block
            const values = await db
                .select()
                .from(fieldValues)
                .where(eq(fieldValues.block_id, block.block_id));

            // Combine field definitions with their values
            const fields = fieldDefs.map((fieldDef) => {
                const fieldValue = values.find(
                    (v) => v.field_def_id === fieldDef.field_def_id,
                );
                return {
                    name: fieldDef.name,
                    label: fieldDef.label,
                    type: fieldDef.type,
                    value: fieldValue
                        ? fieldValue.value
                        : fieldDef.default_value,
                };
            });

            blocksWithContent.push({
                block_id: block.block_id,
                type: block.block_type_name,
                order: block.order,
                fields,
            });
        }

        // Return the page with all its blocks and content
        res.json({
            ...page[0],
            blocks: blocksWithContent,
        });
    } catch (error) {
        res.status(500).json({ error: `Internal server error: ${error}` });
    }
});

// Create a new page
app.post("/api/pages", async (req, res) => {
    try {
        const { title, slug } = req.body;

        if (!title || !slug) {
            return res
                .status(400)
                .json({ error: "Title and slug are required" });
        }

        // Create the page
        const newPage = await db
            .insert(pages)
            .values({
                title,
                slug,
            })
            .returning();

        res.status(201).json(newPage[0]);
    } catch (error) {
        res.status(500).json({ error: `Internal server error: ${error}` });
    }
});

// Update an existing page
app.put("/api/pages/:id", async (req, res) => {
    try {
        const pageId = req.params.id;
        const { title, slug } = req.body;

        // Check if page exists
        const existingPage = await db
            .select()
            .from(pages)
            .where(eq(pages.page_id, pageId))
            .limit(1);

        if (existingPage.length === 0) {
            return res.status(404).json({ error: "Page not found" });
        }

        // Update the page
        const updatedPage = await db
            .update(pages)
            .set({
                title: title || existingPage[0].title,
                slug: slug || existingPage[0].slug,
                updated_at: new Date(),
            })
            .where(eq(pages.page_id, pageId))
            .returning();

        res.json(updatedPage[0]);
    } catch (error) {
        res.status(500).json({ error: `Internal server error: ${error}` });
    }
});

// Delete a page
app.delete("/api/pages/:id", async (req, res) => {
    try {
        const pageId = req.params.id;

        // Delete the page (cascade will delete blocks and field values)
        await db.delete(pages).where(eq(pages.page_id, pageId));

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: `Internal server error: ${error}` });
    }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`✓ Server is running on http://localhost:${PORT}`);
});
