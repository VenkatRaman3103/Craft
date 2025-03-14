import express from "express";
import {
    readCollection,
    getCollectionsByReference,
    getCollectionByCollectionId,
    getCollectionItemsByCollectionId,
} from "./read.js";
import { createCollection } from "./creat.js";
import { deleteCollection } from "./delete.js";
import {
    updateCollection,
    updateCollectionReference,
    updateCollectionType,
} from "./update.js";

export const collectionsRouter = express.Router();

// Create: POST
collectionsRouter.post("/collections", createCollection);

// Read: GET
collectionsRouter.get("/collections", readCollection);
collectionsRouter.get(
    "/collections/references/:reference_id",
    getCollectionsByReference,
);
collectionsRouter.get(
    "/collections/collection/:collection_id",
    getCollectionByCollectionId,
);

// test route
collectionsRouter.get(
    "/collections/collectionItems/:collection_id",
    getCollectionItemsByCollectionId,
);

// Update: PUT/PATCH
collectionsRouter.put("/collections/:collection_id", updateCollection);
collectionsRouter.patch(
    "/collections/reference/:collection_id",
    updateCollectionReference,
);
collectionsRouter.patch(
    "/collection/type/:collection_id",
    updateCollectionType,
);

// Delete: DELETE
collectionsRouter.delete("/collections/:collection_id", deleteCollection);
