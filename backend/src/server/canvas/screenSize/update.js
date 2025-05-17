import { eq } from "drizzle-orm";
import { screenSizes } from "../../../db/schema/canvas/screenSizes.js";
import { db } from "../../server.js";

export const updateScreenSizeName = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        const response = await db
            .update(screenSizes)
            .set({
                name,
            })
            .where(eq(screenSizes.id, id))
            .returning();

        console.log(response[0]);
        res.json(response[0]);
    } catch (error) {
        const errorMessage = {
            error,
            message: `Error in creating the block`,
            origin: "backend/updateScreenSizeName/PATCH",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
};

export const updateScreenSizeWidth = async (req, res) => {
    const { id } = req.params;
    const { width } = req.body;

    try {
        const response = await db
            .update(screenSizes)
            .set({
                width,
            })
            .where(eq(screenSizes.id, id))
            .returning();

        console.log(response[0]);
        res.json(response[0]);
    } catch (error) {
        const errorMessage = {
            error,
            message: `Error in creating the block`,
            origin: "backend/updateScreenSizeWidth/PATCH",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
};

export const updateScreenSizeHeight = async (req, res) => {
    const { id } = req.params;
    const { heigth } = req.body;

    try {
        const response = await db
            .update(screenSizes)
            .set({
                heigth,
            })
            .where(eq(screenSizes.id, id))
            .returning();

        console.log(response[0]);
        res.json(response[0]);
    } catch (error) {
        const errorMessage = {
            error,
            message: `Error in creating the block`,
            origin: "backend/updateScreenSizeWidth/PATCH",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
};
