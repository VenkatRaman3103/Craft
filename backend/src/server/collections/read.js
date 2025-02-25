import { eq } from "drizzle-orm";
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

export async function getCollectionsByReference(req, res) {
    const { reference_id } = req.params;

    try {
        const childCollections = await db
            .select()
            .from(collections)
            .where(eq(collections.reference_id, reference_id));

        res.status(200).json(childCollections);
    } catch (error) {
        console.error("Error fetching collections by reference:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
