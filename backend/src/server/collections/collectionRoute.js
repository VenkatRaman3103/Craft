import express from "express";
import { readCollection } from "./readCollections.js";

export const collectionRouter = express.Router();

collectionRouter.get("/collections", readCollection);
