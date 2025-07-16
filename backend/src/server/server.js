import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

import { eq } from "drizzle-orm";
import * as schema from "../db/schema/index.js";
import { users } from "../db/schema/user.js";
import { canvasElements } from "../db/schema/canvas/canvasElements.js";
import { elementStyles } from "../db/schema/canvas/elementStyles.js";

import { collectionsRouter } from "./collections/route.js";
import { collectionRouter } from "./collection/route.js";
import collectionJoinPageRouter from "./collectionJoinPage/route.js";
import { blocksRouter } from "./blocks/route.js";
import { pagesRoute } from "./pages/route.js";
import { fieldRoute } from "./fields/route.js";
import { collectionItemsRouter } from "./collectionItems/route.js";
import { move } from "./move/route.js";
import { testRoute } from "./test/route.js";
import { arrayBlocksRouter } from "./blocks/arrayBlocks/route.js";
import { apiService } from "./services/api/route.js";
import { tableRouter } from "./blocks/tableBlocks/route.js";
import { referenceBlockRouter } from "./blocks/referenceBlocks/route.js";
import { apiBlockRouter } from "./blocks/apiBlocks/route.js";
import { canvasRouter } from "./canvas/route.js";
import { apiEditorRouter } from "./apiLayer/route.js";
import { mediaBucketRouter } from "./mediaBucket/route.js";
import { uploadsRouter } from "./mediaBucket/uploads/route.js";

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

// Routes
app.get("/api/users", async (req, res) => {
    try {
        const allUsers = await db.select().from(users);
        res.json(allUsers);
    } catch (error) {
        res.status(500).json({ error: `Internal server error ${error}` });
    }
});

app.get("/elements", async (req, res) => {
    try {
        const elements = await db
            .select()
            .from(canvasElements)
            .leftJoin(
                elementStyles,
                eq(canvasElements.elementId, elementStyles.elementId),
            );
        res.json(elements);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch elements" });
    }
});

app.get("/elements/:elementId/styles", async (req, res) => {
    try {
        const { elementId } = req.params;
        const styles = await db
            .select()
            .from(elementStyles)
            .where(eq(elementStyles.elementId, parseInt(elementId)));

        res.json(styles[0] || {});
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch element styles" });
    }
});

app.put("/elements/:elementId/styles", async (req, res) => {
    try {
        const { elementId } = req.params;
        const styleData = req.body;

        const existingStyles = await db
            .select()
            .from(elementStyles)
            .where(eq(elementStyles.elementId, parseInt(elementId)));

        if (existingStyles.length > 0) {
            await db
                .update(elementStyles)
                .set({
                    ...styleData,
                    updatedAt: new Date(),
                })
                .where(eq(elementStyles.elementId, parseInt(elementId)));
        } else {
            await db.insert(elementStyles).values({
                elementId: parseInt(elementId),
                ...styleData,
            });
        }

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Failed to update element styles" });
    }
});

app.post("/elements", async (req, res) => {
    try {
        const elementData = req.body;
        const [newElement] = await db
            .insert(canvasElements)
            .values(elementData)
            .returning();

        res.json(newElement);
    } catch (error) {
        res.status(500).json({ error: "Failed to create element" });
    }
});

// Use routers
app.use("/api", collectionsRouter);
app.use("/api", collectionRouter);
app.use("/api", collectionJoinPageRouter);
app.use("/api", pagesRoute);
app.use("/api", blocksRouter);
app.use("/api", arrayBlocksRouter);
app.use("/api", tableRouter);
app.use("/api", referenceBlockRouter);
app.use("/api", apiBlockRouter);
app.use("/api", fieldRoute);
app.use("/api", collectionItemsRouter);
app.use("/api", apiEditorRouter);
app.use("/services", apiService);
app.use("/api", canvasRouter);
app.use("/api", move);
app.use("/api", testRoute);
app.use("/api", mediaBucketRouter);
app.use("/api", uploadsRouter);

// Example API query with nested relations
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

// Start server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🟢 Server is running on http://localhost:${PORT}`);
});
