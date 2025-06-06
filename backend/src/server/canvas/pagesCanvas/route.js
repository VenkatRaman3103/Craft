import express from "express";
import { createCanvasPages } from "./create.js";
import { getAllCanvasPages, getCanvasPagesById } from "./read.js";
import { deleteCanvasPageById } from "./delete.js";
import {
    updateCanvasPageNameById,
    updateCanvasPageStatusById,
} from "./update.js";

export const pagesCanvasRouter = express.Router();

// create
pagesCanvasRouter.post("/pages", createCanvasPages);
//

// read
pagesCanvasRouter.get("/pages", getAllCanvasPages); // all
pagesCanvasRouter.get("/pages/:id", getCanvasPagesById); // id

// delete
pagesCanvasRouter.delete("/pages/:id", deleteCanvasPageById); // id

// update
pagesCanvasRouter.patch("/pages/:id/name", updateCanvasPageNameById); // name
pagesCanvasRouter.patch("/pages/:id/status", updateCanvasPageStatusById); // status
