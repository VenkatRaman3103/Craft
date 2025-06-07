import { db } from "../../server.js";
import { pagesCanvas } from "../../../db/schema/canvas/pagesCanvas/schema.js";

export const getAllCanvasPages = async (req, res) => {
    try {
        const response = await db.select().from(pagesCanvas);
        res.json(response);
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

export const getCanvasPagesById = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await db.query.pagesCanvas.findFirst({
            where: (pagesCanvas, { eq }) => eq(pagesCanvas.page_id, id),
        });
        res.json(response);
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

// info: get all pages for the specific project, based on project_id
export const getPagesForProject = async (req, res) => {
    const { project_id } = req.params;
    try {
        const response = await db.query.pagesCanvas.findFirst({
            where: (pagesCanvas, { eq }) => eq(pagesCanvas.page_id, project_id),
        });
        res.json(response);
    } catch (error) {
        const errorMessage = {
            error,
            message: `Error in creating the block`,
            origin: "backend/getPagesForProject/GET",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
};
