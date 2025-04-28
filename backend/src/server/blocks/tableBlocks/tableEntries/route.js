import express from "express";
import { createNewEntry } from "./create.js";
import { getEntries, getEntriesByColumsId, getEntriesByRowId } from "./read.js";
import { updateEntryValue } from "./update.js";
import {
    deleteEntries,
    deleteEntriesByColumnId,
    deleteEntriesByRowId,
} from "./delete.js";

export const tableEntriesRoute = express.Router();

// create a entry for the given column_id and row_id
tableEntriesRoute.post("/entries/:row_id/:column_id", createNewEntry);

// read all the entries for the column_id
tableEntriesRoute.get("/entries/:column_id/column", getEntriesByColumsId);

// read all the entries for the row_id
tableEntriesRoute.get("/entries/:row_id/row", getEntriesByRowId);

// read all the entries for the row_id and column_id
tableEntriesRoute.get("/entries/:row_id/:column_id/row/column", getEntries);

// delete all the rows for given column_id
tableEntriesRoute.delete("/entries/:row_id/row", deleteEntriesByRowId);
tableEntriesRoute.delete("/entries/:column_id/column", deleteEntriesByColumnId);
tableEntriesRoute.delete(
    "/entries/:row_id/:column_id/row/column",
    deleteEntries,
);

// update the entries value based on the row_id and column_id
tableEntriesRoute.patch("/entries/:row_id/:column_id/value", updateEntryValue);
