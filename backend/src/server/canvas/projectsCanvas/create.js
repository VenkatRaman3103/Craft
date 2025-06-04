import { projectsCanvas } from "../../../db/schema/canvas/projectCanvas/schema.js";
import { db } from "../../server.js";

export const createProjects = async (req, res) => {
    const { name, status } = req.body;

    try {
        const response = await db
            .insert(projectsCanvas)
            .values([
                {
                    name,
                    status,
                },
            ])
            .returning();

        res.json(response[0]);
    } catch (error) {
        const errorMessage = {
            error,
            message: `Error in creating the block`,
            origin: "backend/createProjects/POST",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
};
