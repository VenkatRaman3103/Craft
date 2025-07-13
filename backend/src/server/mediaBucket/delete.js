import { eq } from "drizzle-orm";
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

// TODO: delete all the buckets
