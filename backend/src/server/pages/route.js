import express from "express";
import { getAllPages, getPageById } from "./read.js";

export const pagesRoute = express.Router();

// READ: all pages
pagesRoute.get("/pages", getAllPages);
// READ: page by id
pagesRoute.get("/page/:page_id", getPageById);

// TODO: pages update
// TODO: pages delete
// TODO: pages create
