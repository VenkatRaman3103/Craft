import { collections } from "../../db/schema/collections.js";
import { db } from "../server.js";
import { eq } from "drizzle-orm";

export async function updateCollection(req, res) {
    const { name, slug, status } = req.body;
    const id = req.params.collection_id;

    try {
        const response = await db
            .update(collections)
            .set({ name, slug, status })
            .where(eq(collections.collection_id, id))
            .returning();

        if (response.length === 0) {
            return res.status(404).json({ message: "Collection not found" });
        }

        res.status(200).json({
            message: "Collection updated successfully",
            data: response[0],
        });
    } catch (error) {
        console.error(`Error updating collection: ${error.message}`);
        res.status(500).json({
            message: `Error updating the collection: ${error.message}`,
            collection_id: id,
            item: req.body,
        });
    }
}

export async function updateCollectionReference(req, res) {
    const { collection_id } = req.params;
    const { reference_id } = req.body;

    try {
        const updatedCollection = await db
            .update(collections)
            .set({ reference_id })
            .where(eq(collections.collection_id, collection_id))
            .returning();

        if (updatedCollection.length === 0) {
            return res.status(404).json({ error: "Collection not found" });
        }

        res.status(200).json({
            message: "Collection reference updated successfully",
            data: updatedCollection[0],
        });
    } catch (error) {
        console.error("Error updating collection reference:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
