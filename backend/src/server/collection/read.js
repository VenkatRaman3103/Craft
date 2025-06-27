import { eq } from "drizzle-orm";
import { collections } from "../../db/schema/collections.js";
import { db } from "../server.js";
import { pages } from "../../db/schema/pages.js";
import { collectionJoinPages } from "../../db/schema/collectionJoinPages.js";

export const getPages = async (collection_id) => {
    const response = await db
        .select()
        .from(collectionJoinPages)
        .innerJoin(
            collections,
            eq(
                collectionJoinPages.collection_ref_id,
                collections.collection_id,
            ),
        )
        .innerJoin(pages, eq(collectionJoinPages.page_ref_id, pages.page_id))
        .where(eq(collections.collection_id, collection_id));
    return response;
};

export async function getPagesForCollection(req, res) {
    const { collection_id } = req.params;

    try {
        const response = await db
            .select()
            .from(collectionJoinPages)
            .innerJoin(
                collections,
                eq(
                    collectionJoinPages.collection_ref_id,
                    collections.collection_id,
                ),
            )
            .innerJoin(
                pages,
                eq(collectionJoinPages.page_ref_id, pages.page_id),
            )
            .where(eq(collections.collection_id, collection_id));

        res.status(200).json(response);
    } catch (error) {
        console.error(
            `Error in fetching the pages for the collection: ${collection_id}`,
        );
        res.status(500).json({
            message: `Error in fetching the pages for the collection: ${collection_id}`,
            error: error,
        });
    }
}

// for reading all the collections
export const getAllCollections = async (req, res) => {
    try {
        const response = await db.select().from(collections);
        res.json(response);
    } catch (error) {
        const errorMessage = {
            error,
            message: `Error in creating the block`,
            origin: "backend/getAllCollections/GET",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
};
