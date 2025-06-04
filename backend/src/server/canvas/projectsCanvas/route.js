import express from "express";
import { createProjects } from "./create.js";
import { getAllProjects, getProjectsById } from "./read.js";
import { deleteProjectsById } from "./delete.js";
import { updateProjectNameById, updateProjectStatusById } from "./update.js";

export const projectCanvasRouter = express.Router();

// create
projectCanvasRouter.post("/projects-canvas", createProjects);

// read
projectCanvasRouter.get("/projects-canvas", getAllProjects); // all
projectCanvasRouter.get("/projects-canvas/:id", getProjectsById); // id

// delete
projectCanvasRouter.delete("/projects-canvas/:id", deleteProjectsById); // id

// update
projectCanvasRouter.patch("/projects-canvas/:id/name", updateProjectNameById); // id
projectCanvasRouter.patch(
    "/projects-canvas/:id/status",
    updateProjectStatusById,
); // id
