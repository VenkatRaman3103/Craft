import express from "express";
import { readPageItems } from "./read.js";

export const pageItems = express.Router();

// Read all collection items
pageItems.get("/page_items", readPageItems);

// Move an item from page_items to collection_items based on the id
