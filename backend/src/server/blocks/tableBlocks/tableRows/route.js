import express from "express";
import { createNewRow } from "./create.js";
import { getRows } from "./read.js";
import { deleteRows } from "./delete.js";
import { updateRowValue } from "./update.js";

export const tableRowsRoute = express.Router();

// create a row for the given column_id
tableRowsRoute.post("/rows/:column_id", createNewRow);

// read all the rows for the column_id
tableRowsRoute.get("/rows/:column_id", getRows);

// delete all the rows for given column_id
tableRowsRoute.delete("/rows/:column_id", deleteRows);

// update the row value
tableRowsRoute.patch("/row/:row_id/value", updateRowValue);
