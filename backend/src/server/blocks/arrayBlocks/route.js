import express from "express";
import {
    getArrayBlocks,
    getArrayBlocksById,
    getArrayBlocksWithTemplates,
    getArrayBlockWithNestedContent,
    nestedArrayBlocks,
} from "./read.js";
import { createArrayBlock, createArrayBlockByRef } from "./create.js";
import { updateArrayBlock, updateNameArrayBlock } from "./update.js";
import { deleteArrayBlock } from "./delete.js";
import { arrayBlockItemsRoute } from "./arrayBlocksItems/route.js";
import { arrayTemplateRoute } from "./arrayTemplate/route.js";

export const arrayBlocksRouter = express.Router();

// note: sub routes
arrayBlocksRouter.use("/array", arrayBlockItemsRoute);
arrayBlocksRouter.use("/array", arrayTemplateRoute);

// READ
arrayBlocksRouter.get("/array", getArrayBlocks); // get all array blocks
arrayBlocksRouter.get("/array/:block_id/id", getArrayBlocksById); // get block by id
arrayBlocksRouter.get(
    "/array/:block_id/templates",
    getArrayBlocksWithTemplates,
);

arrayBlocksRouter.get("/array/:block_id", async (req, res) => {
    try {
        const { block_id } = req.params;

        if (!block_id) {
            return res.status(400).json({ error: "Block ID is required" });
        }

        const blockData = await getArrayBlockWithNestedContent(block_id);

        if (!blockData) {
            return res.status(404).json({ error: "Block not found" });
        }

        res.json(blockData);
    } catch (error) {
        console.error("Error fetching block:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// CREATE
arrayBlocksRouter.post("/array", createArrayBlock); // create array block
arrayBlocksRouter.post("/array/:reference_id/reference", createArrayBlockByRef); // create array block by reference

// UPDATE
arrayBlocksRouter.put("/array/:block_id", updateArrayBlock); // update array block by id
arrayBlocksRouter.patch(
    "/arrayblock/:block_id/name/:name",
    updateNameArrayBlock,
); // update array block by id

// DELETE
arrayBlocksRouter.delete("/array/:block_id", deleteArrayBlock);
