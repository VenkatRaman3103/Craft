import { db } from "../../../server.js";

export const getColumns = async (req, res) => {
    const { table_id } = req.params;

    try {
        const columns = await db.query.tableColumns.findMany({
            where: (tableColumns, { eq }) =>
                eq(tableColumns.table_id, table_id),
        });
        res.json(columns);
    } catch (error) {
        const errorMessage = {
            error: error.message,
            origin: "backend/getCoumns/read/GET",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
};
