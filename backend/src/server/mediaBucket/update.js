import { eq } from "drizzle-orm";
import { mediaBuckets } from "../../db/schema/uploads/mediaBuckets.js";
import { db } from "../server.js";

// update name bucket based on the id
export const newNameForMediaBucket = async (req, res) => {
    const { name } = req.body;
    const { id } = req.params;
    try {
        const response = await db
            .update(mediaBuckets)
            .set({
                name,
            })
            .where(eq(mediaBuckets.id, id))
            .returning();
        res.json(response);
    } catch (error) {
        const erroMessage = {
            error,
            message: `Error in renaming the media bucket`,
            origin: "backend/newNameForMediaBucket/PATCH",
        };
        res.status(500).json(erroMessage);
    }
};
