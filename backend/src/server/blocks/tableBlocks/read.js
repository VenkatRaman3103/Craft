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

export const getTableById = async (req, res) => {
    const { block_id } = req.params;
    try {
        const tableResonse = await db.query.tableBlocks.findFirst({
            where: (tableBlocks, { eq }) => eq(tableBlocks.block_id, block_id),
        });
        res.json(tableResonse);
    } catch (error) {
        const errorMessage = {
            error: error.message,
            origin: "backend/getAllTables/read/GET",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
};
