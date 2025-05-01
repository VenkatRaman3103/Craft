import { eq } from "drizzle-orm";
import { referenceBlock } from "../../../db/schema/blocks/referenceBlock/schema.js";
import { db } from "../../server.js";

export const updateNameReferenceBlock = async (req, res) => {
    const { block_id } = req.params;
    const { name } = req.body;

    try {
        const updatedBlock = await db
            .update(referenceBlock)
            .set({
                name,
            })
            .where(eq(referenceBlock.block_id, block_id))
            .returning();
        res.json(updatedBlock);
    } catch (error) {
        const errorMessage = {
            error: error.message,
            origin: "backend/updateNameReferenceBlock/update/PATCH",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
};

export const updateCollectionIdReferenceBlock = async (req, res) => {
    const { block_id } = req.params;
    const { collection_id } = req.body;

    try {
        const updatedBlock = await db
            .update(referenceBlock)
            .set({
                collection_id,
            })
            .where(eq(referenceBlock.block_id, block_id))
            .returning();
        res.json(updatedBlock);
    } catch (error) {
        const errorMessage = {
            error: error.message,
            origin: "backend/updateCollectionIdReferenceBlock/update/PATCH",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
};

export const updateTypeReferenceBlock = async (req, res) => {
    const { block_id } = req.params;
    const { reference_type } = req.body;

    try {
        const updatedBlock = await db
            .update(referenceBlock)
            .set({
                reference_type,
            })
            .where(eq(referenceBlock.block_id, block_id))
            .returning();
        res.json(updatedBlock);
    } catch (error) {
        const errorMessage = {
            error: error.message,
            origin: "backend/updateCollectionIdReferenceBlock/update/PATCH",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
};
