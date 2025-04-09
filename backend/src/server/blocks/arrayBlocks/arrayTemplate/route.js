import express from "express";
import { getArrayBlockTemplate } from "./read.js";

export const arrayTemplateRoute = express.Router();

// READ
arrayTemplateRoute.get("/templates", getArrayBlockTemplate);
