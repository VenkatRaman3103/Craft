import { pgTable, text, uuid } from "drizzle-orm/pg-core";

export const collections = pgTable("collections", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    parent_collection_id: uuid("parent_collection_id"),

    slug: text("slug").notNull(),
    collection_type: text("collection_type").notNull(),
    item_type: text("item_type").notNull(),

    // TODO: add this
    // pages: [],
    // blocks: [],
    // fields: [],
    // child_collections: [],
});
