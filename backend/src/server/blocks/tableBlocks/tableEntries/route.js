import express from "express";
import { createNewEntry } from "./create.js";

export const tableEntriesRoute = express.Router();

// create a row for the given column_id
tableEntriesRoute.post("/entries/:row_id/:column_id", createNewEntry);

// read all the rows for the column_id
// tableEntriesRoute.get("/entries/:row_id/:column_id", );

// delete all the rows for given column_id
// tableEntriesRoute.delete("/entries/:row_id/:column_id", deleteEntrys);

// update the row value
// tableEntriesRoute.patch("/entries/:row_id/:column_id/value", updateEntryValue);
