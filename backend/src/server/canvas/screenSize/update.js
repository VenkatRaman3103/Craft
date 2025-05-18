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

export const updateScreenSize = async (req, res) => {
    const { id } = req.params;
    const { name, width, heigth } = req.body;

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (width !== undefined) updates.width = width;
    if (heigth !== undefined) updates.heigth = heigth;

    try {
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                error: "No valid update fields provided",
                message:
                    "At least one of name, width, or heigth must be provided",
                origin: "backend/updateScreenSize/PATCH",
            });
        }

        const response = await db
            .update(screenSizes)
            .set(updates)
            .where(eq(screenSizes.id, id))
            .returning();

        console.log("Updated screen size:", response[0]);
        res.json(response[0]);
    } catch (error) {
        const errorMessage = {
            error: error.toString(),
            message: `Error updating the screen size`,
            origin: "backend/updateScreenSize/PATCH",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
};

export const updateScreenSizesStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const [targetEntry] = await db
            .select()
            .from(screenSizes)
            .where(eq(screenSizes.id, id));

        const screenType = targetEntry.screenType;

        await db
            .update(screenSizes)
            .set({ status: "in-active" })
            .where(eq(screenSizes.screenType, screenType));

        const [updated] = await db
            .update(screenSizes)
            .set({ status })
            .where(eq(screenSizes.id, id))
            .returning();

        res.json(updated);
    } catch (error) {
        const errorMessage = {
            error: error.toString(),
            message: `Error updating the screen size`,
            origin: "backend/updateScreenSizesStatus/PATCH",
        };
        console.error(errorMessage);
        res.status(500).json(errorMessage);
    }
};
