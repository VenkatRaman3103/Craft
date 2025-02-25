import express from "express";
import {
    readCollection,
    getCollectionsByReference,
    getCollectionByCollectionId,
} from "./read.js";
import { createCollection } from "./creat.js";
import { deleteCollection } from "./delete.js";
import { updateCollection, updateCollectionReference } from "./update.js";

export const collectionRouter = express.Router();

// Create: POST
collectionRouter.post("/collections", createCollection);

// Read: GET
collectionRouter.get("/collections", readCollection);
collectionRouter.get(
    "/collections/references/:reference_id",
    getCollectionsByReference,
);
collectionRouter.get(
    "/collections/collection/:collection_id",
    getCollectionByCollectionId,
);

// Update: PUT/PATCH
collectionRouter.put("/collections/:collection_id", updateCollection);
collectionRouter.patch(
    "/collections/:collection_id",
    updateCollectionReference,
);

// Delete: DELETE
collectionRouter.delete("/collections/:collection_id", deleteCollection);
