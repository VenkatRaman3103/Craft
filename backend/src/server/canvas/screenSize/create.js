import { screenSizes } from "../../../db/schema/canvas/screenSizes.js";
import { db } from "../../server.js";

export const createScreenSize = async (req, res) => {
    const { type, width, heigth, name } = req.body;
    try {
        const response = await db
            .insert(screenSizes)
            .values([
                {
                    name,
                    type,
                    width,
                    heigth,
                },
            ])
            .returning();
        console.log(response[0]);
        res.json(response[0]);
    } catch (error) {
        const errorMessage = {
            error,
            message: `Error in creating the block`,
            origin: "backend/createScreenSize/POST",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
};
