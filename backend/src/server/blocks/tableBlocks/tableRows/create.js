import { tableRows } from "../../../../db/schema/blocks/tableBlocks/tableRows/schema.js";
import { db } from "../../../server.js";

export const createNewRow = async (req, res) => {
    const { column_id } = req.params;
    const { value } = req.body;

    try {
        const newRow = await db
            .insert(tableRows)
            .values([
                {
                    column_id,
                    value,
                },
            ])
            .returning();

        res.json(newRow[0]);
    } catch (error) {
        const errorMessage = {
            error: error.message,
            origin: "backend/createNewRow/create/POST",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
};
