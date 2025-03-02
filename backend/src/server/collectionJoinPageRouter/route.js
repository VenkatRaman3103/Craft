import express from "express";
import { createNewCollectionPage } from "./create.js";

export const collectionJoinPageRouter = express.Router();

// Create a new collection join page
collectionJoinPageRouter.post("/collection-page", createNewCollectionPage);

export default collectionJoinPageRouter;
