import express from "express";
import { createScreenSize } from "./create.js";
import { getAllScreenSizes, getScreenSizesById } from "./read.js";

export const screenSizeRouter = express.Router();

// create a new screen size
screenSizeRouter.post("/screen-size", createScreenSize);

// read all the screen sizes
screenSizeRouter.get("/screen-size", getAllScreenSizes);
screenSizeRouter.get("/screen-size/:id", getScreenSizesById);

screenSizeRouter.get("/screen-size", async (req, res) => {
    res.json("hello from screen-size");
});
