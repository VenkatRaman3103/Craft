import express from "express";
import { getAllBlocks, getBlockById, getBlockByReference } from "./read.js";
import { deleteBlockById } from "./delete.js";

export const blocksRouter = express.Router();

// Read: all blocks
blocksRouter.get("/blocks", getAllBlocks);
// READ: block by id
blocksRouter.get("/block/:block_id", getBlockById);
// READ: blcok by reference
blocksRouter.get("/block/reference/:reference_id", getBlockByReference);

// TODO: blocks update

// TODO: blocks delete
blocksRouter.delete("/block/:block_id", deleteBlockById);

// TODO: blocks read
