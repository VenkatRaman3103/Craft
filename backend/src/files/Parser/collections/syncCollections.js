import { db } from "../../../server/server.js";
import { collectionsTable } from "../../../db/schema/collections/schema.js";
import { eq } from "drizzle-orm";

export async function syncCollections(collections) {
    const response = [];

    const dbCollections = await db.select().from(collectionsTable);

    for (let config_col of collections) {
        let dbCol = dbCollections.find((col) => col.slug === config_col.slug);
        console.log(dbCol, config_col, "dbCollections");

        if (dbCol) {
            if (
                config_col.name != dbCol.name ||
                config_col.description != dbCol.description ||
                config_col.parent_collection_id != dbCol.parent_collection_id ||
                config_col.slug != dbCol.slug ||
                config_col.collection_type != dbCol.collection_type ||
                config_col.item_type != dbCol.item_type
            ) {
                const update_response = await db
                    .update(collectionsTable)
                    .set({
                        name: config_col.name,
                        description: config_col.description,
                        parent_collection_id: config_col.parent_collection_id,
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
        } else {
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
