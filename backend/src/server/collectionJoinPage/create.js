import { collectionJoinPages } from "../../db/schema/collectionJoinPages.js";
import { db } from "../server.js";

export async function createNewCollectionPage(req, res) {
    try {
        const { page_id, collection_id } = req.body;
        const response = await db
            .insert(collectionJoinPages)
            .values({ page_ref_id: page_id, collection_ref_id: collection_id })
            .returning();
        res.status(201).json({
            message: `Successfully created the collection join page: ${response[0].page_ref_id}`,
            data: response[0],
        });
    } catch (error) {
        console.error(`Error in creating the collection join page: ${error}`);
        res.status(500).json({
            error: "Error creating the collection joing page",
        });
    }
}
