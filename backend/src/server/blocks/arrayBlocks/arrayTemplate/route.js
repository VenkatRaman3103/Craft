import express from "express";
import { getArrayBlockTemplate, getArrayBlockTemplateById } from "./read.js";

export const arrayTemplateRoute = express.Router();

// READ
arrayTemplateRoute.get("/templates", getArrayBlockTemplate);
arrayTemplateRoute.get("/templates/:template_id", getArrayBlockTemplateById);
