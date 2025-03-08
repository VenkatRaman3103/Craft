import {
    pgTable,
    uuid,
    text,
    timestamp,
    varchar,
    foreignKey,
    unique,
    serial,
    primaryKey,
    pgEnum,
} from "drizzle-orm/pg-core";

export const pageItemType = pgEnum("item_type", [
    "block",
    "text_field",
    "multi_select_field",
    "single_select_field",
]);
export const scopeEnum = pgEnum("scope_enum", ["global", "page", "collection"]);

export const blocks = pgTable("blocks", {
    blockId: uuid("block_id").defaultRandom().primaryKey().notNull(),
    name: text().notNull(),
    content: text().notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    editedAt: timestamp("edited_at", { mode: "string" }).defaultNow(),
    referenceId: text("reference_id"),
    scope: scopeEnum().default("global"),
});

export const parent = pgTable("parent", {
    parentId: uuid("parent_id").defaultRandom().primaryKey().notNull(),
    name: varchar().notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
});

export const child = pgTable(
    "child",
    {
        childId: uuid("child_id").defaultRandom().primaryKey().notNull(),
        name: varchar().notNull(),
        parentRefId: uuid("parent_ref_id"),
        createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    },
    (table) => [
        foreignKey({
            columns: [table.parentRefId],
            foreignColumns: [parent.parentId],
            name: "child_parent_ref_id_parent_parent_id_fk",
        }),
    ],
);

export const textFields = pgTable("text_fields", {
    fieldId: uuid("field_id").defaultRandom().primaryKey().notNull(),
    name: varchar().notNull(),
    label: varchar().notNull(),
    value: varchar().notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    editedAt: timestamp("edited_at", { mode: "string" }).defaultNow(),
});

export const pageItems = pgTable(
    "page_items",
    {
        itemId: uuid("item_id").defaultRandom().primaryKey().notNull(),
        pageRefId: uuid("page_ref_id"),
        itemType: pageItemType("item_type").notNull(),
        referenceId: uuid("reference_id").notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.pageRefId],
            foreignColumns: [pages.pageId],
            name: "page_items_page_ref_id_pages_page_id_fk",
        }).onDelete("cascade"),
    ],
);

export const users = pgTable(
    "users",
    {
        id: serial().primaryKey().notNull(),
        name: text().notNull(),
        email: text().notNull(),
        createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    },
    (table) => [unique("users_email_unique").on(table.email)],
);

export const collections = pgTable("collections", {
    collectionId: uuid("collection_id").defaultRandom().primaryKey().notNull(),
    name: text().notNull(),
    status: text().default("draft").notNull(),
    slug: text().notNull(),
    type: text(),
    referenceId: text("reference_id"),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
});

export const pages = pgTable("pages", {
    pageId: uuid("page_id").defaultRandom().primaryKey().notNull(),
    title: text().notNull(),
    slug: text().notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    editedAt: timestamp("edited_at", { mode: "string" }).defaultNow(),
});

export const collectionPages = pgTable(
    "collection_pages",
    {
        collectionRefId: uuid("collection_ref_id").notNull(),
        pageRefId: uuid("page_ref_id").notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.collectionRefId],
            foreignColumns: [collections.collectionId],
            name: "collection_pages_collection_ref_id_collections_collection_id_fk",
        }).onDelete("restrict"),
        foreignKey({
            columns: [table.pageRefId],
            foreignColumns: [pages.pageId],
            name: "collection_pages_page_ref_id_pages_page_id_fk",
        }).onDelete("cascade"),
        primaryKey({
            columns: [table.collectionRefId, table.pageRefId],
            name: "collection_pages_collection_ref_id_page_ref_id_pk",
        }),
    ],
);
