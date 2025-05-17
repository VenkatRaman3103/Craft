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
