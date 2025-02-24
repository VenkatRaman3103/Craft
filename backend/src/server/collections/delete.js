import { eq } from "drizzle-orm";
import { collections } from "../../db/schema/collections.js";
import { db } from "../server.js";

export async function deleteCollection(req, res) {
    const { name } = req.params;

    try {
        const deletedRows = await db
            .delete(collections)
            .where(eq(collections.name, name))
            .returning();

        if (deletedRows.length === 0) {
            return res.status(404).json({ error: "Collection not found" });
        }

        res.status(200).json({
            message: `Collection with ID: ${name} has been deleted`,
            deleted: deletedRows,
        });
    } catch (error) {
        console.error(`Error deleting collection ${name}:`, error);
        res.status(500).json({
            error: "Error deleting the collection",
            name,
        });
    }
}
