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

// TODO: read bucket based on the id
