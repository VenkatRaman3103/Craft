import express from "express";
import { createNewRow } from "./create.js";
import { getRows } from "./read.js";

export const tableRowsRoute = express.Router();

// create a row for the given column_id
tableRowsRoute.post("/rows/:column_id", createNewRow);

// read all the rows for the column_id
tableRowsRoute.get("/rows/:column_id", getRows);
