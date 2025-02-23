import express from "express";
import { readCollection } from "./read.js";
import { createCollection } from "./creat.js";
import { deleteCollection } from "./delete.js";

export const collectionRouter = express.Router();

// get
collectionRouter.get("/collections", readCollection);

// post
collectionRouter.post("/collections", createCollection);

// delete
collectionRouter.delete("/collections/:name", deleteCollection);
