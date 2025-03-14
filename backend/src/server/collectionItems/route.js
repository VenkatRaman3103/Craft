import express from "express";
import { readCollectionItems } from "./read.js";

export const collectionItemsRouter = express.Router();

// Read all collection items
collectionItemsRouter.get("/collectionItems", readCollectionItems);

// Move an item from page_items to collection_items based on the id
