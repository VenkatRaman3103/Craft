import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const collections = pgTable("collections", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    slug: text("slug").notNull(),
    group_id: text("group_id"),
    parent_ele_id: text("parent_ele_id"),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
});
