import express from "express";
import { createScreenSize } from "./create.js";
import { getAllScreenSizes, getScreenSizesById } from "./read.js";
import { deleteScreenSize } from "./delete.js";
import {
    updateScreenSizeHeight,
    updateScreenSizeName,
    updateScreenSizeWidth,
} from "./update.js";

export const screenSizeRouter = express.Router();

// create a new screen size
screenSizeRouter.post("/screen-size", createScreenSize);

// read screen sizes
screenSizeRouter.get("/screen-size", getAllScreenSizes); // all
screenSizeRouter.get("/screen-size/:id", getScreenSizesById); // based on id

// delete screen size based on the id
screenSizeRouter.delete("/screen-size/:id", deleteScreenSize);

// update screen size based on the id
screenSizeRouter.patch("/screen-size/:id/name", updateScreenSizeName);
screenSizeRouter.patch("/screen-size/:id/width", updateScreenSizeWidth);
screenSizeRouter.patch("/screen-size/:id/heigth", updateScreenSizeHeight);
