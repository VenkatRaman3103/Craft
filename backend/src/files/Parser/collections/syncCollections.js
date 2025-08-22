import { db } from "../../../server/server.js";
import { collectionsTable } from "../../../db/schema/collections/schema.js";
import { eq } from "drizzle-orm";
import { makeRelations } from "../../Serializer/makeRelations.js";

// export const getSubCollections =  () => {
//
// };

export function flatternCollection(acc, collections) {
    for (let col of collections) {
        acc.push(col);

        const subCollections = col.elements.filter((item) => {
            item.kind == "collections";
        });

        if (subCollections.length > 0) {
            flatternCollection(acc, subCollections);
        }
    }

    return acc;
}

export const getCollectionId = async (slug) => {
    const collection = await db
        .select()
        .from(collectionsTable)
        .where(eq(collectionsTable.slug, slug));

    console.log(collection[0].id, "collection for id");
};

export async function syncCollections(nested_collection) {
    const response = [];

    const serialized = makeRelations(nested_collection, "");
    console.log(JSON.stringify(serialized, null, 2), "serialized");

    // collections from db
    const dbCollections = await db.select().from(collectionsTable);

    const collections = flatternCollection([], serialized);

    // comparing config with db for insert and update operations
    for (let config_col of collections) {
        let dbCol = dbCollections.find((col) => col.slug === config_col.slug);

        if (dbCol) {
            // update: if any other data apart from `slug` is changed
            if (
                config_col.name != dbCol.name ||
                config_col.description != dbCol.description ||
                config_col.slug != dbCol.slug
            ) {
                const update_response = await db
                    .update(collectionsTable)
                    .set({
                        name: config_col.name,
                        description: config_col.description,
                        slug: config_col.slug,
                        collection_type: config_col.collection_type,
                        item_type: config_col.item_type,
                    })
                    .where(eq(collectionsTable.slug, config_col.slug))
                    .returning();

                const update_message = {
                    update: {
                        collection: dbCol.slug,
                        reponse: update_response[0],
                    },
                };

                response.push(update_message);
            }
        }
        // insert: if collection from config is not in db
        else {
            const insert_response = await db
                .insert(collectionsTable)
                .values({
                    slug: config_col.slug,
                    name: config_col.name,
                    collection_type: config_col.collection_type,
                    item_type: config_col.item_type,
                })
                .onConflictDoNothing({ target: collectionsTable.slug })
                .returning();

            const insert_message = {
                insert: {
                    collection: config_col.slug,
                    reponse: insert_response[0],
                },
            };

            response.push(insert_message);
        }
    }

    // updating parent collection id
    const updatedCollection = await db.select().from(collectionsTable);

    for (let config_col of collections) {
        const parent = updatedCollection.find(
            (updated_col) =>
                updated_col.slug == config_col.parent_collection_slug,
        );

        if (parent) {
            await db
                .update(collectionsTable)
                .set({
                    parent_collection_id: parent.id,
                })
                .where(eq(collectionsTable.slug, config_col.slug));
        }
    }

    // comparing db with config for delete operations
    for (let dbCol of dbCollections) {
        const exists = collections.find((col) => col.slug === dbCol.slug);
        if (!exists) {
            const delete_response = await db
                .delete(collectionsTable)
                .where(eq(collectionsTable.slug, dbCol.slug))
                .returning();

            const delete_message = {
                delete: {
                    collection: dbCol.slug,
                    reponse: delete_response[0],
                },
            };

            response.push(delete_message);
        }
    }

    return response;
}
