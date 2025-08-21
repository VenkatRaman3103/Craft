import { pgTable, text, uuid } from "drizzle-orm/pg-core";

export const collections = pgTable("collections", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    parentCollectionId: uuid("parent_collection_id"),
});
