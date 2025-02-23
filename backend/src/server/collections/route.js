import express from "express";
import { readCollection } from "./read.js";
import { createCollection } from "./creat.js";
import { deleteCollection } from "./delete.js";
import { updateCollection } from "./update.js";

export const collectionRouter = express.Router();

// creat : post
collectionRouter.post("/collections", createCollection);

// read: get
collectionRouter.get("/collections", readCollection);

// update: put
collectionRouter.put("/collections/:collection_id", updateCollection);

// delete: delete
collectionRouter.delete("/collections/:name", deleteCollection);
