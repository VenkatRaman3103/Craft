import { eq } from "drizzle-orm";
import { collectionItems } from "../../db/schema/collections.js";
import { db } from "../server.js";

export async function deleteCollectionItem(req, res) {
    const { page_id } = req.params;
    try {
        const response = await db
            .delete(collectionItems)
            .where(eq(collectionItems.reference_id, page_id));

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}
