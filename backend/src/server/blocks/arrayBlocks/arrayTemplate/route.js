import express from "express";
import { getArrayTemplate, getArrayTemplateById } from "./read.js";
import { createArrayTemplate } from "./create.js";
import { deleteArrayTemplate } from "./delete.js";

export const arrayTemplateRoute = express.Router();

// READ
arrayTemplateRoute.get("/templates", getArrayTemplate);
arrayTemplateRoute.get("/templates/:template_id", getArrayTemplateById);

// CREATE
arrayTemplateRoute.post("/templates", createArrayTemplate);

// UPDATE
// DELETE
arrayTemplateRoute.delete("/templates/:template_id", deleteArrayTemplate);
