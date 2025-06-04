import express from "express";
import { createProjects } from "./create.js";

export const projectCanvasRouter = express.Router();

projectCanvasRouter.post("/projects-canvas", createProjects);
