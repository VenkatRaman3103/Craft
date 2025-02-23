import express from "express";
import { readCollection } from "./read.js";
import { createCollection } from "./creat.js";

export const collectionRouter = express.Router();

collectionRouter.post("/collections", createCollection);
collectionRouter.get("/collections", readCollection);
