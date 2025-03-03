import express from "express";
import { getAllBlocks, getBlockById, getBlockByReference } from "./read.js";

export const blocksRouter = express.Router();

// Read: GET
// read all blocks
blocksRouter.get("/blocks", getAllBlocks);
// read block by id
blocksRouter.get("/block/:block_id", getBlockById);
// read blcok by reference
blocksRouter.get("/block/reference/:reference_id", getBlockByReference);

// TODO: blocks update
// TODO: blocks delete
// TODO: blocks read
