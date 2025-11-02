import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const pages = pgTable("pages", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    slug: text("slug").notNull(),
    parent_element_id: text("parent_element_id"),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
});
