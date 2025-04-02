import express from "express";
import { getArrayBlocks, getArrayBlocksById, nestedArrayBlocks } from "./read.js";
import { createArrayBlock, createArrayBlockByRef } from "./create.js";
import { updateArrayBlock, updateNameArrayBlock } from "./update.js";
import { deleteArrayBlock} from "./delete.js";


export const arrayBlocksRouter = express.Router();

// READ
arrayBlocksRouter.get("/arrayblocks", getArrayBlocks); // get all array blocks
arrayBlocksRouter.get("/arrayblock/:block_id", getArrayBlocksById); // get block by id
arrayBlocksRouter.get("/nested/arrayblock/:block_id", nestedArrayBlocks);

// CREATE
arrayBlocksRouter.post("/arrayblock", createArrayBlock); // create array block
arrayBlocksRouter.post("/arrayblock/:reference_id", createArrayBlockByRef); // create array block by reference

// UPDATE
arrayBlocksRouter.put("/arrayblock/:block_id", updateArrayBlock); // update array block by id
arrayBlocksRouter.patch(
    "/arrayblock/:block_id/name/:name",
    updateNameArrayBlock,
); // update array block by id

// DELETE
arrayBlocksRouter.delete("/arrayblock/:block_id", deleteArrayBlock);
