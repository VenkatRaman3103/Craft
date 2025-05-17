import express from "express";
import { screenSizeRouter } from "./screenSize/route.js";

export const canvasRouter = express.Router();

canvasRouter.use("/canvas", screenSizeRouter);
