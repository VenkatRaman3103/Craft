import express from "express";
import { createArrayBlockItem } from "./create.js";
import { readArrayBlockItems } from "./read.js";
import { deleteBlockByReference } from "./delete.js";

export const arrayBlockItemsRoute = express.Router();

// READ
arrayBlockItemsRoute.get("/block_items", readArrayBlockItems);

// CREATE
arrayBlockItemsRoute.post(`/:block_id/block_items`, createArrayBlockItem);

// DELETE
arrayBlockItemsRoute.delete(
    `/block_items/:reference_id`,
    deleteBlockByReference,
);
