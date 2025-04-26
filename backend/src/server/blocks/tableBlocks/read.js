import { tableBlocks } from "../../../db/schema/blocks/tableBlocks/schema.js";
import { db } from "../../server.js";

export const getAllTables = async (req, res) => {
    try {
        const allTables = await db.select().from(tableBlocks);
        res.json(allTables);
    } catch (error) {
        const errorMessage = {
            error: error.message,
            origin: "backend/getAllTables/read/GET",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
};
