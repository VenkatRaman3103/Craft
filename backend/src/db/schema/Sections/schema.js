import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const sections = pgTable("sections", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    type: text("type").notNull(),
    parent_page_id: text("parent_page_id").notNull(),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
});
