import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { users } from "../db/schema/user.js";
import { eq } from "drizzle-orm";
import { collectionsRouter } from "./collections/route.js";
import { collectionRouter } from "./collection/route.js";
import collectionJoinPageRouter from "./collectionJoinPage/route.js";
import { blocksRouter } from "./blocks/route.js";
import { pagesRoute } from "./pages/route.js";
import * as schema from "../db/schema/index.js";
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
import { canvasElements } from "../db/schema/canvas/canvasElements.js";
import { elementStyles } from "../db/schema/canvas/elementStyles.js";
import { apiEditorRouter } from "./apiLayer/route.js";

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
    .then(() => console.log("🟢 Connected to the db"))
    // .then(() => console.log("🞆 Connected to the db"))
    .catch((error) => console.log(`Failed to connect: ${error}`));

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

// Get specific element styles
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

// Update element styles
app.put("/elements/:elementId/styles", async (req, res) => {
    try {
        const { elementId } = req.params;
        const styleData = req.body;

        // Check if styles exist
        const existingStyles = await db
            .select()
            .from(elementStyles)
            .where(eq(elementStyles.elementId, parseInt(elementId)));

        if (existingStyles.length > 0) {
            // Update existing styles
            await db
                .update(elementStyles)
                .set({
                    ...styleData,
                    updatedAt: new Date(),
                })
                .where(eq(elementStyles.elementId, parseInt(elementId)));
        } else {
            // Insert new styles
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

// Create new element
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

// collections
app.use("/api", collectionsRouter);
app.use("/api", collectionRouter);
app.use("/api", collectionJoinPageRouter);

// pages
app.use("/api", pagesRoute);

// blocks
app.use("/api", blocksRouter);
app.use("/api", arrayBlocksRouter);
app.use("/api", tableRouter);
app.use("/api", referenceBlockRouter);
app.use("/api", apiBlockRouter);

// field
app.use("/api", fieldRoute);

// collectionItems
app.use("/api", collectionItemsRouter);

// api layer
app.use("/api", apiEditorRouter);

// services
// api
app.use("/services", apiService);

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

app.use("/api", move);

app.use("/api", testRoute);

//////////   CANVAS   //////////
app.use("/api", canvasRouter);

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🟢 Server is running on http://localhost:${PORT}`);
});
