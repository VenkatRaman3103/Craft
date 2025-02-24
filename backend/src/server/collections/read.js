import { collections } from "../../db/schema/collections.js";
import { db } from "../server.js";

export async function readCollection(req, res) {
    try {
        const allCollections = await db.select().from(collections);
        res.json(allCollections);
    } catch (error) {
        console.error("Error fetching collections:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
