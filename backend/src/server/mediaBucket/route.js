import express from "express";
import { db } from "../server.js";
import { mediaBucket } from "../../db/schema/index.js";

export const mediaBucketRouter = express.Router();

mediaBucketRouter.get("/media-bucket", async (req, res) => {
    try {
        const response = await db.select().from(mediaBucket);
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: `Internal server error ${error}` });
    }
});
