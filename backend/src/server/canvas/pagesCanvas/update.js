import { db } from "../../server.js";
import { pagesCanvas } from "../../../db/schema/canvas/pagesCanvas/schema.js";
import { eq } from "drizzle-orm";

export const updateCanvasPageNameById = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const response = await db
            .update(pagesCanvas)
            .set({
                name,
            })
            .where(eq(pagesCanvas.page_id, id))
            .returning();
        res.json(response[0]);
    } catch (error) {
        const errorMessage = {
            error,
            message: `Error in creating the block`,
            origin: "backend/updateCanvasPageNameById/PATCH",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
};

export const updateCanvasPageStatusById = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const response = await db
            .update(pagesCanvas)
            .set({
                status,
            })
            .where(eq(pagesCanvas.page_id, id))
            .returning();
        res.json(response[0]);
    } catch (error) {
        const errorMessage = {
            error,
            message: `Error in creating the block`,
            origin: "backend/updateCanvasPageNameById/PATCH",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
};
