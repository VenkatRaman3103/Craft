import express from "express";
import { createNewColumn } from "./create.js";
import { getColumns } from "./read.js";
import { deleteColumn } from "./delete.js";
import { updateColumnValue } from "./update.js";

export const tableColumsRoute = express.Router();

// create a new columns based on the table_id
tableColumsRoute.post("/columns/:table_id", createNewColumn);

// read colums based on the table_id
tableColumsRoute.get("/columns/:table_id", getColumns);

// delete a colum based on the column_id
tableColumsRoute.delete("/columns/:column_id/column", deleteColumn);
// tableColumsRoute.delete("/columns/:column_id/column", deleteColumn);

// update the column value based on the column_id
tableColumsRoute.patch("/columns/:column_id/value", updateColumnValue);
