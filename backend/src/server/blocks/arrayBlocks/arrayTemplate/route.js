import express from "express";
import { getArrayTemplate, getArrayTemplateById } from "./read.js";
import { createArrayTemplate } from "./create.js";

export const arrayTemplateRoute = express.Router();

// READ
arrayTemplateRoute.get("/templates", getArrayTemplate);
arrayTemplateRoute.get("/templates/:template_id", getArrayTemplateById);

// CREATE
arrayTemplateRoute.post("/templates", createArrayTemplate);

// UPDATE
// DELETE
