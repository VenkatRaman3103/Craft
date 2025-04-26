import { tableBlocks } from "../../../db/schema/blocks/tableBlocks/schema.js";
import { db } from "../../server.js";

export const createNewTable = async (req, res) => {
    const { name } = req.body;
    try {
        const newTableResponse = await db
            .insert(tableBlocks)
            .values([
                {
                    name,
                },
            ])
            .returning();
        res.json(newTableResponse[0]);
    } catch (error) {
        const errorMessage = {
            error: error.message,
            origin: "backend/createNewTable/read/GET",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
};
