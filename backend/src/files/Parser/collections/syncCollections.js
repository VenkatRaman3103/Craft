import { db } from "../../../server/server.js";
import {
    collectionsTable,
    subCollectionsTable,
    subPagesTable,
} from "../../../db/schema/collections/schema.js";
import { eq } from "drizzle-orm";
import { makeRelations } from "../../Serializer/makeRelations.js";
import { pagesTable } from "../../../db/schema/index.js";

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

export const getCollectionId = async (slug) => {
    const collection = await db
        .select()
        .from(collectionsTable)
        .where(eq(collectionsTable.slug, slug));
    // console.log(collection[0].id, "collection for id");
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

    // pages
    const dbPages = await db.select().from(pagesTable);
    const pages = flatternPages([], serialized);

    // sub-page
    const dbSubPages = await db.select().from(subPagesTable);
    const subPages = flatternSubPage([], serialized);

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

    // SYNC PAGES
    for (let config_page of pages) {
        let dbCol = dbPages.find((col) => col.slug === config_page.slug);

        let isCollection = dbCollections.find(
            (col) => col.slug === config_page.slug,
        );

        if (dbCol) {
            if (
                config_page.name != dbCol.name ||
                config_page.description != dbCol.description ||
                config_page.slug != dbCol.slug
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
                    update: {
                        page: dbCol.slug,
                        response: update_response[0],
                    },
                });
            }
        } else {
            if (isCollection == undefined) {
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

    console.log(pages, "pages");

    // delete pages not in config
    for (let dbPage of dbPages) {
        const exists = pages.find((page) => page.slug === dbPage.slug);
        if (!exists) {
            const delete_response = await db
                .delete(pagesTable)
                .where(eq(pagesTable.slug, dbPage.slug))
                .returning();

            response.push({
                delete: {
                    page: dbPage.slug,
                    response: delete_response[0],
                },
            });
        }
    }

    // SYNC SUB-PAGES
    for (let config_sub of subPages) {
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

    // update parent_collection_id for sub-pages
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

    // update sub_page_id for pages
    for (let config_page of pages) {
        const parent = updatedSubPage.find(
            (updated_page) =>
                updated_page.slug == config_page.parent_sub_pages_slug,
        );

        if (parent) {
            await db
                .update(pagesTable)
                .set({ sub_page_id: parent.id })
                .where(eq(pagesTable.slug, config_page.slug));
        }
    }

    // delete sub-pages not in config
    for (let dbSub of dbSubPages) {
        const exists = subPages.find((sub) => sub.slug === dbSub.slug);
        if (!exists) {
            const delete_response = await db
                .delete(subPagesTable)
                .where(eq(subPagesTable.slug, dbSub.slug))
                .returning();

            response.push({
                delete: {
                    subPage: dbSub.slug,
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

    // update parent_collection_id for sub-collections
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

    // set sub_table_id for collections with parent_sub_collection_slug
    const tem_collections = flatternCollection([], serialized);
    for (let col of tem_collections) {
        if (col.parent_sub_collection_slug) {
            const { id: subCollectionId } = dbSubCollections.find(
                (item) => item.slug == col.parent_sub_collection_slug,
            );
            await db
                .update(collectionsTable)
                .set({
                    sub_table_id: subCollectionId,
                })
                .where(eq(collectionsTable.slug, col.slug));
        }
    }

    return response;
}
