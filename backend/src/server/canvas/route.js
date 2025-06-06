import express from "express";
import { screenSizeRouter } from "./screenSize/route.js";
import { projectCanvasRouter } from "./projectsCanvas/route.js";
import { pagesCanvasRouter } from "./pagesCanvas/route.js";

export const canvasRouter = express.Router();

canvasRouter.use("/canvas", screenSizeRouter);
canvasRouter.use("/canvas", projectCanvasRouter);
canvasRouter.use("/canvas", pagesCanvasRouter);
