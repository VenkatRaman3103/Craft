import { collections } from "../../db/schema/collection.js";
import { db } from "../server.js";

export async function createCollection(req, res) {
    const { collection_id, name, slug, status } = req.body;

    try {
        const response = await db
            .insert(collections)
            .values({
                collection_id,
                name,
                slug,
                status,
            })
            .returning();

        res.status(201).json({
            message: `Successfully created the collection: ${response[0].name}`,
            data: response[0],
        });
    } catch (error) {
        console.error(`Error in creating the collection: ${error}`);
        res.status(500).json({ error: "Error creating the collection" });
    }
}
