import express from "express";
import { createProjects } from "./create.js";
import { getAllProjects } from "./read.js";

export const projectCanvasRouter = express.Router();

// create
projectCanvasRouter.post("/projects-canvas", createProjects);

// read
projectCanvasRouter.get("/projects-canvas", getAllProjects);
