import { eq } from "drizzle-orm";
import { projectsCanvas } from "../../../db/schema/canvas/projectCanvas/schema.js";
import { db } from "../../server.js";

export const deleteProjectsById = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await db
            .delete(projectsCanvas)
            .where(eq(projectsCanvas.project_id, id))
            .returning();
        res.json(response[0]);
    } catch (error) {
        const errorMessage = {
            error,
            message: `Error in creating the block`,
            origin: "backend/deleteAllProjectsById/DELETE",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
};
