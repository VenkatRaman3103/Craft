import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const collections = pgTable("collections", {
    id: serial("id").primaryKey(),
    name: text("name"),
    description: text("description"),
    parent_collection_id: text("parent_collection_id"),
});
