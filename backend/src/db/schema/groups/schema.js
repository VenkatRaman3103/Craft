import { pgTable, text, uuid } from "drizzle-orm/pg-core";

export const groupsTable = pgTable("groups", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    heading: text("heading"),
});

export const groupsJoinCollection = pgTable("groups_collections", {
    id: uuid("id").defaultRandom().primaryKey(),
    collection_id: text("collection_id").notNull(),
    group_id: text("group_id").notNull(),
});
