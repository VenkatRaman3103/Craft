import { relations } from "drizzle-orm";
import { pgTable, text, uuid, unique } from "drizzle-orm/pg-core";

// Collections
export const collectionsTable = pgTable(
    "collections",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        name: text("name").notNull(),
        description: text("description"),
        parent_collection_id: uuid("parent_collection_id"),
        slug: text("slug").notNull(),
    },
    (table) => {
        return {
            slugUnique: unique("collections_slug_unique").on(table.slug),
        };
    },
);

// Sub-Collections
export const subCollectionsTable = pgTable(
    "sub_collections",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        name: text("name").notNull(),
        slug: text("slug").notNull(),
        parent_collection_slug: text("parent_collection_slug"),
        parent_collection_id: uuid("parent_collection_id"),
    },
    (table) => {
        return {
            slugUnique: unique("sub_collections_slug_unique").on(table.slug),
        };
    },
);
