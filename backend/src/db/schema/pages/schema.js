import { pgTable, text, uuid, unique } from "drizzle-orm/pg-core";

export const pagesTable = pgTable("pages", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    sub_collection_id: uuid("sub_collection_id"),
    slug: text("slug").notNull(),
});
