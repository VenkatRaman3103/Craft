import express from "express";
import { readCollectionItems } from "./read.js";
import { createCollectionItem } from "./create.js";

export const collectionItemsRouter = express.Router();

// Read all collection items
collectionItemsRouter.get("/collectionItems", readCollectionItems);

collectionItemsRouter.post(
    "/collection/:collection_id/collection_items",
    createCollectionItem,
);

// Move an item from page_items to collection_items based on the id
