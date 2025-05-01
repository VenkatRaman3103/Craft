import { referenceBlock } from "../../../db/schema/blocks/referenceBlock/schema.js";
import { db } from "../../server.js";

export const createReferenceBlock = async (req, res) => {
    const { reference_type, collection_id, name } = req.body;

    try {
        const newReferencBlock = await db
            .insert(referenceBlock)
            .values([
                {
                    name,
                    reference_type,
                    collection_id,
                },
            ])
            .returning();
        res.json(newReferencBlock[0]);
    } catch (error) {
        const errorMessage = {
            error: error.message,
            origin: "backend/createReferenceBlock/create/POST",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
};
