import express from "express";
import { getAllPages, getPageById } from "./read.js";
import { createPage } from "./create.js";
import { deletePage } from "./delete.js";

export const pagesRoute = express.Router();

// READ: all pages
pagesRoute.get("/pages", getAllPages);
// READ: page by id
pagesRoute.get("/page/:page_id", getPageById);

// CREATE: page
pagesRoute.post("/page", createPage);

// DELETE: page by id
pagesRoute.delete("/page/:id", deletePage);

// TODO: pages update
// TODO: pages delete
