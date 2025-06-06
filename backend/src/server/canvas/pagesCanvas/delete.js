import { db } from "../../server.js";
import { pagesCanvas } from "../../../db/schema/canvas/pagesCanvas/schema.js";
import { eq } from "drizzle-orm";

export const deleteCanvasPageById = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await db
            .delete(pagesCanvas)
            .where(eq(pagesCanvas.page_id, id))
            .returning();

        res.json(response[0]);
    } catch (error) {
        const errorMessage = {
            error,
            message: `Error in creating the block`,
            origin: "backend/getAllCanvasPages/GET",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
};
