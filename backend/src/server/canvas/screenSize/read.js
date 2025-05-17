import { screenSizes } from "../../../db/schema/canvas/screenSizes.js";
import { db } from "../../server.js";

export const getAllScreenSizes = async (req, res) => {
    try {
        const response = await db.select().from(screenSizes);
        res.json(response);
    } catch (error) {
        const errorMessage = {
            error,
            message: `Error in creating the block`,
            origin: "backend/getAllScreenSizes/GET",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
};

export const getScreenSizesById = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await db.query.screenSizes.findFirst({
            where: (screenSizes, { eq }) => eq(screenSizes.id, id),
        });
        res.json(response);
    } catch (error) {
        const errorMessage = {
            error,
            message: `Error in creating the block`,
            origin: "backend/getAllScreenSizes/GET",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
};
