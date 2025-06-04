import { eq } from "drizzle-orm";
import { projectsCanvas } from "../../../db/schema/canvas/projectCanvas/schema.js";
import { db } from "../../server.js";

export const updateProjectsById = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const response = await db
            .update(projectsCanvas)
            .set({
                name,
            })
            .where(eq(projectsCanvas.project_id, id))
            .returning();
        res.json(response[0]);
    } catch (error) {
        const errorMessage = {
            error,
            message: `Error in creating the block`,
            origin: "backend/updateProjectsById/UPDATE",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
};
