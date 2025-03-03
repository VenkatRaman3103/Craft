import express from "express";
import { getAllPages } from "./read.js";

export const pagesRoute = express.Router();

// TODO: pages read
pagesRoute.get("/pages", getAllPages);

// TODO: pages update
// TODO: pages delete
// TODO: pages create
