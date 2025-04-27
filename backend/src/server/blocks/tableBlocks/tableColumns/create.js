import { tableColumns } from "../../../../db/schema/blocks/tableBlocks/tableColumns/schema.js";
import { db } from "../../../server.js";

export const createNewColumn = async (req, res) => {
    const { table_id } = req.params;
    const { value } = req.body;
    try {
        const newColumn = await db
            .insert(tableColumns)
            .values([
                {
                    value,
                    table_id,
                },
            ])
            .returning();
        res.json(newColumn[0]);
    } catch (error) {
        const errorMessage = {
            error: error.message,
            origin: "backend/createNewColumn/create/POST",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
};
