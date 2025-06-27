import express from "express";
import { getAllCollections, getPagesForCollection } from "./read.js";

export const collectionRouter = express.Router();

// React: GET
collectionRouter.get("/collection/:collection_id", getPagesForCollection);

// React: GET
collectionRouter.get("/collections", getAllCollections);
