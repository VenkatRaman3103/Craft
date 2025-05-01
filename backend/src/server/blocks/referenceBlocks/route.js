import express from "express";
import { createReferenceBlock } from "./create.js";
import { getAllReferenceBlocks, getReferenceBlock } from "./read.js";

export const referenceBlockRouter = express.Router();

// create new reference block
referenceBlockRouter.post("/reference", createReferenceBlock);

// read all the reference blocks
referenceBlockRouter.get("/reference", getAllReferenceBlocks);

// read the reference block based on the block_id
referenceBlockRouter.get("/reference/:block_id", getReferenceBlock);
