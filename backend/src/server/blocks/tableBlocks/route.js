import express from "express";
import { getAllTables, getTableById } from "./read.js";
import { createNewTable } from "./create.js";
import { updateTableName } from "./update.js";
import { deleteTable } from "./delete.js";
import { tableColumsRoute } from "./tableColumns/route.js";
import { tableRowsRoute } from "./tableRows/route.js";

export const tableRouter = express.Router();

tableRouter.use("/table", tableColumsRoute);
tableRouter.use("/table", tableRowsRoute);

// read all tables
tableRouter.get("/table", getAllTables);
tableRouter.get("/table/:block_id", getTableById);

// create new table
tableRouter.post("/table", createNewTable);

// update the table with new name
tableRouter.patch("/table/:block_id/name", updateTableName);

tableRouter.delete("/table/:block_id", deleteTable);
