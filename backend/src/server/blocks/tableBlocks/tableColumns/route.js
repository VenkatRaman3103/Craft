import express from "express";
import { createNewColumn } from "./create.js";

export const tableColumsRoute = express.Router();

// create a new columns based on the table id
tableColumsRoute.post("/columns/:table_id", createNewColumn);
