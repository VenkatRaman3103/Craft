import { db } from "../../../server/server.js";
import {
    collectionsTable,
    subCollectionsTable,
    subPagesTable,
} from "../../../db/schema/collections/schema.js";
import { eq } from "drizzle-orm";
import { makeRelations } from "../../Serializer/makeRelations.js";
import { pagesTable } from "../../../db/schema/index.js";

// NOTE: flattern
// flattern pages
export function flatternPages(acc, arr) {
    for (let page of arr) {
        if (page.elements) {
            acc.push(page);
            flatternPages(
                acc,
                page.elements.filter((item) => item.kind == "pages"),
            );
        } else {
            flatternPages(acc, page.items);
        }
    }
    return acc;
}

// flattern collections
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

// flattern sub-collections
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

// flattern sub-pages
export const flatternSubPage = (acc, arr) => {
    for (let col of arr) {
        if (col.elements) {
            flatternSubPage(
                acc,
                col.elements.filter((item) => item.kind == "pages"),
            );
        } else {
            acc.push(col);
            flatternSubPage(acc, col.items);
        }
    }
    return acc;
};

// NOTE: helpers
// get collection id
export const getCollectionId = async (slug) => {
    const collection = await db
        .select()
        .from(collectionsTable)
        .where(eq(collectionsTable.slug, slug));
};

//  NOTE: Sync Collections
async function syncCollectionsTable(
    configCollections,
    dbCollections,
    response,
) {
    for (let config_col of configCollections) {
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

    // delete missing collections
    for (let dbCol of dbCollections) {
        const exists = configCollections.find((col) => col.slug === dbCol.slug);
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
}

// NOTE: Sync Pages
async function syncPagesTable(configPages, dbPages, dbCollections, response) {
    for (let config_page of configPages) {
        let dbPage = dbPages.find((col) => col.slug === config_page.slug);
        let isCollection = dbCollections.find(
            (col) => col.slug === config_page.slug,
        );

        if (dbPage) {
            if (
                config_page.name != dbPage.name ||
                config_page.description != dbPage.description ||
                config_page.slug != dbPage.slug
            ) {
                const update_response = await db
                    .update(pagesTable)
                    .set({
                        name: config_page.name,
                        description: config_page.description,
                        slug: config_page.slug,
                    })
                    .where(eq(pagesTable.slug, config_page.slug))
                    .returning();

                response.push({
                    update: { page: dbPage.slug, response: update_response[0] },
                });
            }
        } else {
            if (!isCollection) {
                const insert_response = await db
                    .insert(pagesTable)
                    .values({
                        slug: config_page.slug,
                        name: config_page.name,
                        description: config_page.description,
                    })
                    .onConflictDoNothing({ target: pagesTable.slug })
                    .returning();

                response.push({
                    insert: {
                        page: config_page.slug,
                        response: insert_response[0],
                    },
                });
            }
        }
    }

    // delete missing pages
    for (let dbPage of dbPages) {
        const exists = configPages.find((page) => page.slug === dbPage.slug);
        if (!exists) {
            const delete_response = await db
                .delete(pagesTable)
                .where(eq(pagesTable.slug, dbPage.slug))
                .returning();

            response.push({
                delete: { page: dbPage.slug, response: delete_response[0] },
            });
        }
    }
}

// NOTE: Sync SubCollections
async function syncSubCollectionsTable(
    configSubCollections,
    dbSubCollections,
    updatedCollection,
    response,
) {
    for (let config_sub of configSubCollections) {
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

    // delete missing sub-collections
    for (let dbSub of dbSubCollections) {
        const exists = configSubCollections.find(
            (sub) => sub.slug === dbSub.slug,
        );
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

    // update parent_collection_id
    for (let config_sub of configSubCollections) {
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
}

// NOTE: Sync SubPages
async function syncSubPagesTable(
    configSubPages,
    dbSubPages,
    updatedCollection,
    response,
) {
    for (let config_sub of configSubPages) {
        let dbSub = dbSubPages.find((sub) => sub.slug === config_sub.slug);

        if (dbSub) {
            if (
                config_sub.name != dbSub.name ||
                config_sub.slug != dbSub.slug ||
                config_sub.parent_collection_slug !=
                    dbSub.parent_collection_slug
            ) {
                const update_response = await db
                    .update(subPagesTable)
                    .set({
                        name: config_sub.name,
                        slug: config_sub.slug,
                        parent_collection_slug:
                            config_sub.parent_collection_slug,
                    })
                    .where(eq(subPagesTable.slug, config_sub.slug))
                    .returning();

                response.push({
                    update: {
                        subPage: dbSub.slug,
                        response: update_response[0],
                    },
                });
            }
        } else {
            const insert_response = await db
                .insert(subPagesTable)
                .values({
                    slug: config_sub.slug,
                    name: config_sub.name,
                    parent_collection_slug: config_sub.parent_collection_slug,
                })
                .onConflictDoNothing({ target: subPagesTable.slug })
                .returning();

            response.push({
                insert: {
                    subPage: config_sub.slug,
                    response: insert_response[0],
                },
            });
        }
    }

    // delete missing sub-pages
    for (let dbSub of dbSubPages) {
        const exists = configSubPages.find((sub) => sub.slug === dbSub.slug);
        if (!exists) {
            const delete_response = await db
                .delete(subPagesTable)
                .where(eq(subPagesTable.slug, dbSub.slug))
                .returning();

            response.push({
                delete: { subPage: dbSub.slug, response: delete_response[0] },
            });
        }
    }

    // update parent_collection_id
    const updatedSubPage = await db.select().from(subPagesTable);
    for (let page of updatedSubPage) {
        const parent = await db.query.collectionsTable.findFirst({
            where: eq(collectionsTable.slug, page.parent_collection_slug),
        });
        if (parent) {
            await db
                .update(subPagesTable)
                .set({ parent_collection_id: parent.id })
                .where(eq(subPagesTable.slug, page.slug));
        }
    }
}

// NOTE: Main syncCollections
export async function syncCollections(nested_collection) {
    const response = [];
    const serialized = makeRelations(nested_collection, "");

    // flatten
    const collections = flatternCollection([], serialized);
    const subCollections = flatternSubCollection([], serialized);
    const pages = flatternPages([], serialized);
    const subPages = flatternSubPage([], serialized);

    // db fetch
    const dbCollections = await db.select().from(collectionsTable);
    const dbSubCollections = await db.select().from(subCollectionsTable);
    const dbPages = await db.select().from(pagesTable);
    const dbSubPages = await db.select().from(subPagesTable);

    // sync
    await syncCollectionsTable(collections, dbCollections, response);
    const updatedCollection = await db.select().from(collectionsTable);
    await syncPagesTable(pages, dbPages, dbCollections, response);
    await syncSubPagesTable(subPages, dbSubPages, updatedCollection, response);
    await syncSubCollectionsTable(
        subCollections,
        dbSubCollections,
        updatedCollection,
        response,
    );

    return response;
}
