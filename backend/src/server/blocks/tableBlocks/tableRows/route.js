import express from "express";
import { createNewRow } from "./create.js";

export const tableRowsRoute = express.Router();

// create a row for the given column_id

tableRowsRoute.post("/rows/:column_id", createNewRow);
