import { projectsCanvas } from "../../../db/schema/canvas/projectCanvas/schema.js";
import { db } from "../../server.js";

export const getAllProjects = async (req, res) => {
    try {
        const response = await db.select().from(projectsCanvas);

        res.json(response);
    } catch (error) {
        const errorMessage = {
            error,
            message: `Error in creating the block`,
            origin: "backend/getAllProjects/GET",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
};

export const getProjectsById = async (req, res) => {
    const { id } = req.params;

    try {
        const response = await db.query.projectsCanvas.findFirst({
            where: (projectsCanvas, { eq }) =>
                eq(projectsCanvas.project_id, id),
        });

        res.json(response);
    } catch (error) {
        const errorMessage = {
            error,
            message: `Error in creating the block`,
            origin: "backend/getAllProjects/GET",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
};
