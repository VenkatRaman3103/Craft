import { collectionItems } from "../../db/schema/collections.js";
import { db } from "../server.js";

export async function readCollectionItems(req, res) {
    try {
        const allCollectionItems = await db.select().from(collectionItems);
        res.status(200).json(allCollectionItems);
    } catch (error) {
        const errorMessage = {
            error,
            message: "Error in fetching collection_items fields",
            origin: "backend/collectionItemsRouter/GET",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
}
