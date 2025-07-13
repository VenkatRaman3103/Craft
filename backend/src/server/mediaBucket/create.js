import { mediaBuckets } from "../../db/schema/uploads/mediaBuckets.js";
import { db } from "../server.js";

// create new bucket
export const createNewBucket = async (req, res) => {
    const { name, parentId } = req.body;
    try {
        const response = await db
            .insert(mediaBuckets)
            .values([
                {
                    name,
                    parentId: parentId ? parentId : null,
                },
            ])
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
