import express from "express";
import { createArrayBlockItem } from "./create.js";
import { readArrayBlockItems } from "./read.js";

export const arrayBlockItemsRoute = express.Router();

// READ
arrayBlockItemsRoute.get("/block_items", readArrayBlockItems);

// CREATE
arrayBlockItemsRoute.post(`/:block_id/block_items`, createArrayBlockItem);
