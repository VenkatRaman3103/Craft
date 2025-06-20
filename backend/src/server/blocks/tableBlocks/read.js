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

export async function getTableData(block_id) {
    try {
        const columns = await db.query.tableColumns.findMany({
            where: (tableColumns, { eq }) =>
                eq(tableColumns.table_id, block_id),
        });

        const rows = await db.query.tableRows.findMany({
            where: (tableRows, { eq }) => eq(tableRows.table_id, block_id),
        });

        const rowsWithNames = rows.map((row, index) => ({
            ...row,
            name: row.value || `Row ${index + 1}`,
        }));

        const tableData = {
            columns: columns,
            rows: rowsWithNames,
            grid: [],
        };

        for (const row of rowsWithNames) {
            const rowEntries = await db.query.tableEntries.findMany({
                where: (tableEntries, { eq }) =>
                    eq(tableEntries.row_id, row.row_id),
            });

            const rowData = columns.map((column) => {
                const entry = rowEntries.find(
                    (entry) => entry.column_id === column.column_id,
                );
                return entry ? entry.value : null;
            });

            tableData.grid.push({
                row_id: row.row_id,
                cells: rowData,
            });
        }

        return tableData;
    } catch (error) {
        console.error("Error fetching table data:", error);
        return {
            columns: [],
            rows: [],
            grid: [],
        };
    }
}
