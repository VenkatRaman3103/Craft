import { eq } from "drizzle-orm";
import { screenSizes } from "../../../db/schema/canvas/screenSizes.js";
import { db } from "../../server.js";

export const deleteScreenSize = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await db
            .delete(screenSizes)
            .where(eq(screenSizes.id, id))
            .returning();
        console.log(response[0], " is deleted");
        res.json(response[0]);
    } catch (error) {
        const errorMessage = {
            error,
            message: `Error in creating the block`,
            origin: "backend/deleteScreenSize/DELETE",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
};
