import express from "express";
import {
    getArrayBlocks,
    getArrayBlocksById,
    nestedArrayBlocks,
} from "./read.js";
import { createArrayBlock, createArrayBlockByRef } from "./create.js";
import { updateArrayBlock, updateNameArrayBlock } from "./update.js";
import { deleteArrayBlock } from "./delete.js";

export const arrayBlocksRouter = express.Router();

// READ
arrayBlocksRouter.get("/array", getArrayBlocks); // get all array blocks
arrayBlocksRouter.get("/array/:block_id/id", getArrayBlocksById); // get block by id
arrayBlocksRouter.get("/array/:block_id", nestedArrayBlocks);

// CREATE
arrayBlocksRouter.post("/array", createArrayBlock); // create array block
arrayBlocksRouter.post("/array/:reference_id", createArrayBlockByRef); // create array block by reference

// UPDATE
arrayBlocksRouter.put("/array/:block_id", updateArrayBlock); // update array block by id
arrayBlocksRouter.patch(
    "/arrayblock/:block_id/name/:name",
    updateNameArrayBlock,
); // update array block by id

// DELETE
arrayBlocksRouter.delete("/array/:block_id", deleteArrayBlock);
