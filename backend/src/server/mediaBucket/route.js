import express from "express";
import { db } from "../server.js";
import { mediaBuckets, uploads } from "../../db/schema/index.js";
import { readAllBuckets } from "./read.js";
import { createNewBucket } from "./create.js";
import { deleteBucketById, deleteBucketByIds } from "./delete.js";

export const mediaBucketRouter = express.Router();

// media buckets
mediaBucketRouter.get("/media-buckets", readAllBuckets);

// create new buckets
mediaBucketRouter.post("/media-buckets", createNewBucket);

// delete
mediaBucketRouter.delete("/media-buckets/:id", deleteBucketById);
mediaBucketRouter.delete("/media-buckets", deleteBucketByIds);

// uploads
mediaBucketRouter.get("/uploads", async (req, res) => {
    try {
        const response = await db.select().from(uploads);
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: `Internal server error ${error}` });
    }
});
