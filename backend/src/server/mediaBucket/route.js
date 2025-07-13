import express from "express";
import { db } from "../server.js";
import { uploads } from "../../db/schema/index.js";
import { mediaBuckets } from "../../db/schema/uploads/mediaBuckets.js";

export const mediaBucketRouter = express.Router();

// media buckets
mediaBucketRouter.get("/media-buckets", async (req, res) => {
    try {
        const response = await db.select().from(mediaBuckets);
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: `Internal server error ${error}` });
    }
});

// uploads
mediaBucketRouter.get("/uploads", async (req, res) => {
    try {
        const response = await db.select().from(uploads);
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: `Internal server error ${error}` });
    }
});
