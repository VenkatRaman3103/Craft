import express from "express";
import { db } from "../server.js";
import { mediaBuckets, uploads } from "../../db/schema/index.js";
import { readAllBuckets, readAllRootBuckets, readBucketById } from "./read.js";
import { createNewBucket, createNewChildBucket } from "./create.js";
import { deleteBucketById, deleteBucketByIds } from "./delete.js";
import { newNameForMediaBucket } from "./update.js";

export const mediaBucketRouter = express.Router();

// media buckets
mediaBucketRouter.get("/media-buckets", readAllBuckets); // all media buckets
mediaBucketRouter.get("/media-buckets/root", readAllRootBuckets); // root buckets
mediaBucketRouter.get("/media-buckets/:id", readBucketById); // media buckets with child buckets

// create new buckets
mediaBucketRouter.post("/media-buckets", createNewBucket);
mediaBucketRouter.post("/media-buckets/:parent_id", createNewChildBucket);

// delete
mediaBucketRouter.delete("/media-buckets/:id", deleteBucketById);
mediaBucketRouter.delete("/media-buckets", deleteBucketByIds);

// update
mediaBucketRouter.patch("/media-buckets/:id/name", newNameForMediaBucket);

// uploads
mediaBucketRouter.get("/uploads", async (req, res) => {
    try {
        const response = await db.select().from(uploads);
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: `Internal server error ${error}` });
    }
});
