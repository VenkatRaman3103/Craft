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

export async function getCollectionByCollectionId(req, res) {
    const { collection_id } = req.params;

    try {
        const collection = await db
            .select()
            .from(collections)
            .where(eq(collections.collection_id, collection_id));
        res.status(200).json(collection);
    } catch (error) {
        console.log(`Error in fetching the collection by Id: ${collection_id}`);
        res.status(500).json({ error: error });
    }
}

function reorganizeCollectionData(collection) {
    if (!collection) {
        return null;
    }

    const { collection_items, ...collectionInfo } = collection;

    const pages = [];
    const nonPageItems = [];

    if (collection_items && Array.isArray(collection_items)) {
        collection_items.forEach((item) => {
            if (item.item_type === "page") {
                // Only push the reference_id as we don't have actual page data
                pages.push({
                    reference_id: item.reference_id,
                    item_id: item.item_id,
                    createdAt: item.createdAt,
                    editedAt: item.editedAt,
                });
            } else {
                nonPageItems.push(item);
            }
        });
    }

    return {
        ...collectionInfo,
        pages,
        collection_items: nonPageItems,
    };
}

export async function getCollectionItemsByCollectionId(req, res) {
    const { collection_id } = req.params;
    try {
        const test = await db.query.collections.findFirst({
            where: (collection, { eq }) =>
                eq(collection.collection_id, collection_id),
            with: {
                collection_items: {
                    with: {
                        textarea_field: true,
                    },
                },
            },
        });
        console.log(test, "collectionData");

        const collectionData = await db.query.collections.findFirst({
            where: (collection, { eq }) =>
                eq(collection.collection_id, collection_id),
            with: {
                collection_items: {
                    with: {
                        text_field: true,
                        // normal: true,
                        // array: true,
                        // table: true,
                        // reference: true,
                        // api: true,
                        multi_select_field: {
                            with: {
                                options: true,
                            },
                        },
                        single_select_field: {
                            with: {
                                options: true,
                            },
                        },
                        number_field: true,
                        email_field: true,
                        date_field: true,
                        json_field: true,
                        color_picker_field: true,
                        textarea_field: true,
                        url_field: true,
                    },
                },
            },
        });

        if (!collectionData) {
            return res.status(404).json({ error: "Collection not found" });
        }

        const reorganizedData = reorganizeCollectionData(collectionData);

        res.status(200).json(reorganizedData);
    } catch (error) {
        console.error(
            `Error in fetching the collection items by Id: ${collection_id}`,
            error,
        );
        res.status(500).json({
            error: error.message || "Internal Server Error",
        });
    }
}
