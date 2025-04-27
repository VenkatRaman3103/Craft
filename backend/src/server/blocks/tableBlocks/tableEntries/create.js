import { tableEntries } from "../../../../db/schema/blocks/tableBlocks/tableEntries/schema.js";
import { db } from "../../../server.js";

export const createNewEntry = async (req, res) => {
    const { column_id, row_id } = req.params;
    const { value } = req.body;
    try {
        const newEntry = await db
            .insert(tableEntries)
            .values([
                {
                    value,
                    column_id,
                    row_id,
                },
            ])
            .returning();
        res.json(newEntry[0]);
    } catch (error) {
        const errorMessage = {
            error: error.message,
            origin: "backend/createNewEntry/create/POST",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
};
