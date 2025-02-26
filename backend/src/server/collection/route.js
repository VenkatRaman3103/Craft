import express from "express";
import { getPagesForCollection } from "./read.js";

export const collectionRouter = express.Router();

// React: GET
collectionRouter.get("/collection/:collection_id", getPagesForCollection);
