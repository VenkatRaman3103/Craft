import { db } from "../../server.js";
import { pagesCanvas } from "../../../db/schema/canvas/pagesCanvas/schema.js";

export const createCanvasPages = async (req, res) => {
    const { name, status, project_id } = req.body;

    try {
        const response = await db
            .insert(pagesCanvas)
            .values([
                {
                    name,
                    status,
                    project_id,
                },
            ])
            .returning();

        res.json(response[0]);
    } catch (error) {
        const errorMessage = {
            error,
            message: `Error in creating the block`,
            origin: "backend/createCanvasPages/POST",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
};
