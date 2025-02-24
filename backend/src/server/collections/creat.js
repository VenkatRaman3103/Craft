import { collections } from "../../db/schema/collections.js";
import { db } from "../server.js";

export async function createCollection(req, res) {
    try {
        const response = await db
            .insert(collections)
            .values({ ...req.body })
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
