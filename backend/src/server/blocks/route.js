import express from "express";
import {
    getAllBlocks,
    getBlockById,
    getBlockByReference,
    getBlockWithNestedContent,
} from "./read.js";
import { deleteBlockById, deleteBlockByReference } from "./delete.js";
import { creatBlock, createBlockOnRef, creatBlockItem } from "./create.js";

export const blocksRouter = express.Router();

// READ
blocksRouter.get("/blocks", getAllBlocks);

blocksRouter.get("/normal/:block_id", async (req, res) => {
    try {
        const { block_id } = req.params;

        if (!block_id) {
            return res.status(400).json({ error: "Block ID is required" });
        }

        const blockData = await getBlockWithNestedContent(block_id);

        if (!blockData) {
            return res.status(404).json({ error: "Block not found" });
        }

        res.json(blockData);
    } catch (error) {
        console.error("Error fetching block:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

blocksRouter.get("/normal/reference/:reference_id", getBlockByReference); // blcok by reference

// TODO: blocks update

// TODO: blocks delete
blocksRouter.delete("/normal/:block_id", deleteBlockById);
blocksRouter.delete("/block_items/:reference_id", deleteBlockByReference);

// CREATE
blocksRouter.post("/normal", creatBlock);
blocksRouter.post("/normal/reference/:reference_id", createBlockOnRef); // block based on reference
blocksRouter.post(`/normal/:block_id/block_items`, creatBlockItem);
