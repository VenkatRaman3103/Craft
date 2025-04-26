import express from "express";
import { getAllTables } from "./read.js";
import { createNewTable } from "./create.js";

export const tableRouter = express.Router();

// read all tables
tableRouter.get("/table", getAllTables);

// create new table
tableRouter.post("/table", createNewTable);
