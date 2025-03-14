import express from "express";
import { createNewCollectionPage } from "./create.js";
import { getCollectionByPageId } from "./read.js";

export const collectionJoinPageRouter = express.Router();

// Create a new collection join page
collectionJoinPageRouter.post("/collection-page", createNewCollectionPage);

// get collectin based on page_id
collectionJoinPageRouter.get(
    "/collection_page/:page_id",
    getCollectionByPageId,
);

export default collectionJoinPageRouter;
