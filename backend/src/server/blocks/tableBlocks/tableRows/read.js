import { db } from "../../../server.js";

export const getRows = async (req, res) => {
    const { table_id } = req.params;
    try {
        const rowsResponse = await db.query.tableRows.findMany({
            where: (tableRows, { eq }) => eq(tableRows.table_id, table_id),
        });

        res.json(rowsResponse);
    } catch (error) {
        const errorMessage = {
            error: error.message,
            origin: "backend/getRows/read/GET",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
};
