import { collectionItems } from "../../db/schema/collections.js";
import { db } from "../server.js";

export async function createCollectionItem(req, res) {
    const { collection_id } = req.params;
    const { reference_id, type } = req.body;

    try {
        const response = await db
            .insert(collectionItems)
            .values({
                collection_ref_id: collection_id,
                reference_id: reference_id,
                item_type: type,
            })
            .returning();

        res.status(201).json(response);
    } catch (error) {
        const errorMessage = {
            error,
            message: "Error in creating collection_items",
            origin: "backend/collectionItemsRouter/POST",
        };
        res.status(500).json(errorMessage);
    }
}
