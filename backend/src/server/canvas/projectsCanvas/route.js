import express from "express";
import { createProjects } from "./create.js";
import { getAllProjects, getAllProjectsById } from "./read.js";
import { deleteAllProjectsById } from "./delete.js";

export const projectCanvasRouter = express.Router();

// create
projectCanvasRouter.post("/projects-canvas", createProjects);

// read
projectCanvasRouter.get("/projects-canvas", getAllProjects); // all
projectCanvasRouter.get("/projects-canvas/:id", getAllProjectsById); // id

// delete
projectCanvasRouter.delete("/projects-canvas/:id", deleteAllProjectsById); // id
