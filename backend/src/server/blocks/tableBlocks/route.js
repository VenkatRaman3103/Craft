import express from "express";
import { getAllTables } from "./read.js";
import { createNewTable } from "./create.js";
import { updateTableName } from "./update.js";

export const tableRouter = express.Router();

// read all tables
tableRouter.get("/table", getAllTables);

// create new table
tableRouter.post("/table", createNewTable);

// update the table with new name
tableRouter.patch("/table/:block_id/name", updateTableName);
