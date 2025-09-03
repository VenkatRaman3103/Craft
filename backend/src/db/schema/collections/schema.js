import { pgTable, text, uuid, unique } from "drizzle-orm/pg-core";

// Collections
export const collectionsTable = pgTable(
    "collections",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        name: text("name").notNull(),
        description: text("description"),
        parent_collection_id: uuid("parent_collection_id"),
        table: text("table"),
        sub_table_id: uuid("sub_table_id"),
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
        // references collectionsTable.id
    },
    (table) => {
        return {
            slugUnique: unique("sub_collections_slug_unique").on(table.slug),
        };
    },
);

// sub pages
export const subPagesTable = pgTable(
    "sub_pages",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        name: text("name").notNull(),
        slug: text("slug").notNull(),
        parent_collection_slug: text("parent_collection_slug"),
        parent_collection_id: uuid("parent_collection_id"),
    },
    (table) => {
        return {
            slugUnique: unique("sub_pages_slug_unique").on(table.slug),
        };
    },
);

// sub fields
export const subFieldsTable = pgTable(
    "sub_pages",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        name: text("name").notNull(),
        slug: text("slug").notNull(),
        parent_collection_slug: text("parent_collection_slug"),
        parent_collection_id: uuid("parent_collection_id"),
    },
    (table) => {
        return {
            slugUnique: unique("sub_fields_slug_unique").on(table.slug),
        };
    },
);
