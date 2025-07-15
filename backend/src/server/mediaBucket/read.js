import { eq, isNull } from "drizzle-orm";
import { mediaBuckets } from "../../db/schema/uploads/mediaBuckets.js";
import { db } from "../server.js";

// read all the buckets
export const readAllBuckets = async (req, res) => {
    try {
        const response = await db.select().from(mediaBuckets);
        res.json(response);
    } catch (error) {
        const erroMessage = {
            error,
            message: `Error in creating the page`,
            origin: "backend/readAllBuckets/GET",
        };
        res.status(500).json(erroMessage);
    }
};

// read root bucket based whose parent id is null
export const readAllRootBuckets = async (req, res) => {
    try {
        const response = await db
            .select()
            .from(mediaBuckets)
            .where(isNull(mediaBuckets.parentId, null));

        res.json(response);
    } catch (error) {
        const erroMessage = {
            error,
            message: `Error in creating the media bucket`,
            origin: "backend/readAllBuckets/GET",
        };
        res.status(500).json(erroMessage);
    }
};

// read bucket based on the id, with child buckets
export const readBucketById = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await db
            .select()
            .from(mediaBuckets)
            .where(eq(mediaBuckets.parentId, id));

        res.json(response);
    } catch (error) {
        const erroMessage = {
            error,
            message: `Error in creating the media bucket`,
            origin: "backend/readAllBuckets/GET",
        };
        res.status(500).json(erroMessage);
    }
};
