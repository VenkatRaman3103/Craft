import express from "express";
import { db } from "../server.js";
import { mediaBuckets, uploads } from "../../db/schema/index.js";
import { readAllBuckets, readAllRootBuckets, readBucketById } from "./read.js";
import { createNewBucket, createNewChildBucket } from "./create.js";
import { deleteBucketById, deleteBucketByIds } from "./delete.js";
import { newNameForMediaBucket } from "./update.js";

export const mediaBucketRouter = express.Router();

// Media buckets
mediaBucketRouter.get("/media-buckets", readAllBuckets); // all media buckets
mediaBucketRouter.get("/media-buckets/root", readAllRootBuckets); // root buckets
mediaBucketRouter.get("/media-buckets/:id", readBucketById); // media buckets with child buckets

// Create new buckets
mediaBucketRouter.post("/media-buckets", createNewBucket);
mediaBucketRouter.post("/media-buckets/:parent_id", createNewChildBucket);

// Delete
mediaBucketRouter.delete("/media-buckets/:id", deleteBucketById);
mediaBucketRouter.delete("/media-buckets", deleteBucketByIds);

// Update
mediaBucketRouter.patch("/media-buckets/:id/name", newNameForMediaBucket);

// Get uploads for a specific media bucket
mediaBucketRouter.get("/media-buckets/:id/uploads", async (req, res) => {
    try {
        const { id } = req.params;
        const response = await db.query.uploads.findMany({
            where: (uploads, { eq }) => eq(uploads.mediaBucketId, id),
            with: {
                mediaBucket: true,
            },
        });
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: `Internal server error ${error}` });
    }
});

// Get all uploads (moved from uploads functionality)
mediaBucketRouter.get("/uploads", async (req, res) => {
    try {
        const response = await db.select().from(uploads);
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: `Internal server error ${error}` });
    }
});
