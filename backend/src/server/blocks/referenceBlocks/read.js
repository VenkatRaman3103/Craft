import { referenceBlock } from "../../../db/schema/blocks/referenceBlock/schema.js";
import { db } from "../../server.js";

export const getAllReferenceBlocks = async (req, res) => {
    try {
        const allReferenceBlocks = await db.select().from(referenceBlock);
        res.json(allReferenceBlocks);
    } catch (error) {
        const errorMessage = {
            error: error.message,
            origin: "backend/getAllReferenceBlocks/read/GET",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
};

export const getReferenceBlock = async (req, res) => {
    const { block_id } = req.params;

    try {
        const referenceBlock = await db.query.referenceBlock.findFirst({
            where: (block, { eq }) => eq(block.block_id, block_id),
        });
        res.json(referenceBlock);
    } catch (error) {
        const errorMessage = {
            error: error.message,
            origin: "backend/getAllReferenceBlocks/read/GET",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
};
