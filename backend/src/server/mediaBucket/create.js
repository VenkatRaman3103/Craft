import { mediaBuckets } from "../../db/schema/uploads/mediaBuckets.js";
import { db } from "../server.js";

// create new bucket
export const createNewBucket = async (req, res) => {
    const { name } = req.body;
    try {
        const response = await db
            .insert(mediaBuckets)
            .values([
                {
                    name,
                    parentId: null,
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

// create new child bucket
export const createNewChildBucket = async (req, res) => {
    const { name } = req.body;
    const { parent_id } = req.params;
    try {
        const response = await db
            .insert(mediaBuckets)
            .values([
                {
                    name,
                    parentId: parent_id,
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
