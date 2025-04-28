import { tableEntries } from "../../../../db/schema/blocks/tableBlocks/tableEntries/schema.js";
import { db } from "../../../server.js";

export const getEntriesByRowId = async (req, res) => {
    const { row_id } = req.params;

    try {
        const entries = await db.query.tableEntries.findMany({
            where: (tableEntries, { eq }) => eq(tableEntries.row_id, row_id),
        });

        res.json(entries);
    } catch (error) {
        const errorMessage = {
            error: error.message,
            origin: "backend/getEntriesByRowId/read/GET",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
};

export const getEntriesByColumsId = async (req, res) => {
    const { column_id } = req.params;

    try {
        const entries = await db.query.tableEntries.findMany({
            where: (tableEntries, { eq }) =>
                eq(tableEntries.column_id, column_id),
        });

        res.json(entries);
    } catch (error) {
        const errorMessage = {
            error: error.message,
            origin: "backend/getEntriesByColumsId/read/GET",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
};

export const getEntries = async (req, res) => {
    const { column_id, row_id } = req.params;

    try {
        const entries = await db.query.tableEntries.findMany({
            where: (tableEntries, { eq, and }) =>
                and(
                    eq(tableEntries.column_id, column_id),
                    eq(tableEntries.row_id, row_id),
                ),
        });

        res.json(entries);
    } catch (error) {
        const errorMessage = {
            error: error.message,
            origin: "backend/getEntriesByColumsId/read/GET",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
};
