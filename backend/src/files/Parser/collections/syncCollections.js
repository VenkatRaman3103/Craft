import { db } from "../../../server/server.js";
import {
    collectionsTable,
    subCollectionsTable,
} from "../../../db/schema/collections/schema.js";
import { eq } from "drizzle-orm";
import { makeRelations } from "../../Serializer/makeRelations.js";

export function flatternCollection(acc, arr) {
    for (let col of arr) {
        if (col.elements) {
            acc.push(col);
            flatternCollection(
                acc,
                col.elements.filter((item) => item.kind == "collections"),
            );
        } else {
            flatternCollection(acc, col.items);
        }
    }

    return acc;
}

export const flatternSubCollection = (acc, arr) => {
    for (let col of arr) {
        if (col.elements) {
            flatternSubCollection(
                acc,
                col.elements.filter((item) => item.kind == "collections"),
            );
        } else {
            acc.push(col);
            flatternSubCollection(acc, col.items);
        }
    }

    return acc;
};

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

    // collections
    const dbCollections = await db.select().from(collectionsTable);
    const collections = flatternCollection([], serialized);

    // sub-collections
    const dbSubCollections = await db.select().from(subCollectionsTable);
    const subCollections = flatternSubCollection([], serialized);

    // SYNC COLLECTIONS
    for (let config_col of collections) {
        let dbCol = dbCollections.find((col) => col.slug === config_col.slug);

        if (dbCol) {
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
                    })
                    .where(eq(collectionsTable.slug, config_col.slug))
                    .returning();

                response.push({
                    update: {
                        collection: dbCol.slug,
                        response: update_response[0],
                    },
                });
            }
        } else {
            const insert_response = await db
                .insert(collectionsTable)
                .values({
                    slug: config_col.slug,
                    name: config_col.name,
                    description: config_col.description,
                })
                .onConflictDoNothing({ target: collectionsTable.slug })
                .returning();

            response.push({
                insert: {
                    collection: config_col.slug,
                    response: insert_response[0],
                },
            });
        }
    }

    // update parent_collection_id for collections
    const updatedCollection = await db.select().from(collectionsTable);
    for (let config_col of collections) {
        const parent = updatedCollection.find(
            (updated_col) =>
                updated_col.slug == config_col.parent_collection_slug,
        );
        if (parent) {
            await db
                .update(collectionsTable)
                .set({ parent_collection_id: parent.id })
                .where(eq(collectionsTable.slug, config_col.slug));
        }
    }

    // delete collections not in config
    for (let dbCol of dbCollections) {
        const exists = collections.find((col) => col.slug === dbCol.slug);
        if (!exists) {
            const delete_response = await db
                .delete(collectionsTable)
                .where(eq(collectionsTable.slug, dbCol.slug))
                .returning();

            response.push({
                delete: {
                    collection: dbCol.slug,
                    response: delete_response[0],
                },
            });
        }
    }

    // SYNC SUB-COLLECTIONS
    for (let config_sub of subCollections) {
        let dbSub = dbSubCollections.find(
            (sub) => sub.slug === config_sub.slug,
        );

        if (dbSub) {
            if (
                config_sub.name != dbSub.name ||
                config_sub.slug != dbSub.slug ||
                config_sub.parent_collection_slug !=
                    dbSub.parent_collection_slug
            ) {
                const update_response = await db
                    .update(subCollectionsTable)
                    .set({
                        name: config_sub.name,
                        slug: config_sub.slug,
                        parent_collection_slug:
                            config_sub.parent_collection_slug,
                    })
                    .where(eq(subCollectionsTable.slug, config_sub.slug))
                    .returning();

                response.push({
                    update: {
                        subCollection: dbSub.slug,
                        response: update_response[0],
                    },
                });
            }
        } else {
            const insert_response = await db
                .insert(subCollectionsTable)
                .values({
                    slug: config_sub.slug,
                    name: config_sub.name,
                    parent_collection_slug: config_sub.parent_collection_slug,
                })
                .onConflictDoNothing({ target: subCollectionsTable.slug })
                .returning();

            response.push({
                insert: {
                    subCollection: config_sub.slug,
                    response: insert_response[0],
                },
            });
        }
    }

    for (let config_sub of subCollections) {
        const parent = updatedCollection.find(
            (col) => col.slug == config_sub.parent_collection_slug,
        );
        if (parent) {
            await db
                .update(subCollectionsTable)
                .set({ parent_collection_id: parent.id })
                .where(eq(subCollectionsTable.slug, config_sub.slug));
        }
    }

    // delete sub-collections not in config
    for (let dbSub of dbSubCollections) {
        const exists = subCollections.find((sub) => sub.slug === dbSub.slug);
        if (!exists) {
            const delete_response = await db
                .delete(subCollectionsTable)
                .where(eq(subCollectionsTable.slug, dbSub.slug))
                .returning();

            response.push({
                delete: {
                    subCollection: dbSub.slug,
                    response: delete_response[0],
                },
            });
        }
    }

    const tem_collections = flatternCollection([], serialized);

    for (let col of tem_collections) {
        if (col.parent_sub_collection_slug) {
            const { id: subCollectionId } = dbSubCollections.find(
                (item) => item.slug == col.parent_sub_collection_slug,
            );

            await db
                .update(collectionsTable)
                .set({
                    sub_collection_id: subCollectionId,
                })
                .where(eq(collectionsTable.slug, col.slug));

            console.log(
                col.parent_sub_collection_slug,
                subCollectionId,
                "subCollectionId",
            );
        }
    }

    // // update parent_collection_id for sub-collections
    // const updatedCollections = await db.select().from(collectionsTable);
    //
    // for (let config_sub of subCollections) {
    //     const parent = updatedCollections.find(
    //         (col) => col.slug === config_sub.parent_collection_slug,
    //     );
    //
    //     if (parent) {
    //         await db
    //             .update(subCollectionsTable)
    //             .set({ parent_collection_id: parent.id })
    //             .where(eq(subCollectionsTable.slug, config_sub.slug));
    //     }
    // }

    return response;
}
