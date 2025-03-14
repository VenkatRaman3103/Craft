import { collectionJoinPages } from "../../db/schema/collectionJoinPages.js";
import { db } from "../server.js";

export async function getCollectionByPageId(req, res) {
    const { page_id } = req.params;

    try {
        const response = await db.query.collectionJoinPages.findFirst({
            where: (collectionJoinPages, { eq }) =>
                eq(collectionJoinPages.page_ref_id, page_id),
        });
        res.status(200).json(response);
    } catch (error) {
        const errorMessage = {
            error,
            message: "Error in fetching colleciton_pages fields",
            origin: "backend/collection_page/GET",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
}
