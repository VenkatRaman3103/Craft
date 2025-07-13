import { eq, inArray } from "drizzle-orm";
import { mediaBuckets } from "../../db/schema/uploads/mediaBuckets.js";
import { db } from "../server.js";

// delete bucket based on the id
export const deleteBucketById = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await db
            .delete(mediaBuckets)
            .where(eq(mediaBuckets.id, id))
            .returning();
        res.json(response);
    } catch (error) {
        const erroMessage = {
            error,
            message: `Error in creating the media bucket`,
            origin: "backend/createNewBucket/POST",
        };
        res.status(500).json(erroMessage);
    }
};

// delete all the buckets based on array
export const deleteBucketByIds = async (req, res) => {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
        return res
            .status(400)
            .json({ message: "Invalid or empty 'ids' array." });
    }

    try {
        const response = await db
            .delete(mediaBuckets)
            .where(inArray(mediaBuckets.id, ids))
            .returning();

        res.json(response);
    } catch (error) {
        res.status(500).json({
            error: error.message || error,
            message: "Error deleting media buckets",
            origin: "backend/deleteBucketByIds/DELETE",
        });
    }
};
