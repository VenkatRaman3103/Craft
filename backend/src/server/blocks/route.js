import express from "express";
import { getAllBlocks, getBlockById, getBlockByReference } from "./read.js";
import { deleteBlockById } from "./delete.js";
import { creatBlock, createBlockOnRef } from "./create.js";

export const blocksRouter = express.Router();

// READ
blocksRouter.get("/blocks", getAllBlocks); // all blocks
blocksRouter.get("/block/:block_id", getBlockById); // block by id
blocksRouter.get("/block/reference/:reference_id", getBlockByReference); // blcok by reference

// TODO: blocks update

// TODO: blocks delete
blocksRouter.delete("/block/:block_id", deleteBlockById);

// CREATE
blocksRouter.post("/block", creatBlock);
blocksRouter.post("/block/reference/:reference_id", createBlockOnRef); // block based on reference
