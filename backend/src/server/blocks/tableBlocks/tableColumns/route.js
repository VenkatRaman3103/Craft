import express from "express";
import { createNewColumn } from "./create.js";
import { getColumns } from "./read.js";

export const tableColumsRoute = express.Router();

// create a new columns based on the table id
tableColumsRoute.post("/columns/:table_id", createNewColumn);

// read colums based on the table id
tableColumsRoute.get("/columns/:table_id", getColumns);
