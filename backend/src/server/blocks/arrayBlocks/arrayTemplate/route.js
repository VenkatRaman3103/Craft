import express from "express";
import { getArrayTemplate, getArrayTemplateById } from "./read.js";
import { createArrayTemplate } from "./create.js";
import { deleteArrayTemplate } from "./delete.js";
import {
    updateArrayTemplteDescription,
    updateArrayTemplteName,
} from "./update.js";

export const arrayTemplateRoute = express.Router();

// READ
arrayTemplateRoute.get("/templates", getArrayTemplate);
arrayTemplateRoute.get("/templates/:template_id", getArrayTemplateById);

// CREATE
arrayTemplateRoute.post("/templates", createArrayTemplate);

// UPDATE
arrayTemplateRoute.patch(
    "/templates/:template_id/name",
    updateArrayTemplteName,
);

arrayTemplateRoute.patch(
    "/templates/:template_id/description",
    updateArrayTemplteDescription,
);

// DELETE
arrayTemplateRoute.delete("/templates/:template_id", deleteArrayTemplate);
