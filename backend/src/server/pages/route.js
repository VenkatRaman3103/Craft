import express from "express";
import { getAllPages, getPageById, getRawPageById } from "./read.js";
import { createPage } from "./create.js";
import { deletePage } from "./delete.js";
import { createPageItem } from "./page_items/create.js";
import { readPageItems } from "./page_items/read.js";

export const pagesRoute = express.Router();

// READ: all pages
pagesRoute.get("/pages", getAllPages);
// READ: page by id
pagesRoute.get("/page/:page_id", getRawPageById);
pagesRoute.get("/page/:page_id/transformed", getPageById);

// CREATE: page
pagesRoute.post("/page", createPage);

// DELETE: page by id
pagesRoute.delete("/page/:id", deletePage);

// TODO: pages update

// TODO: pages_items create
pagesRoute.post("/page/:page_id/page_items", createPageItem);
pagesRoute.get("/page_items", readPageItems);
