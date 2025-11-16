import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const page_items = pgTable("page_items", {
    id: uuid("id").defaultRandom().primaryKey(),
    element_type: text("element_type").notNull(),
    element_id: text("element_id").notNull(),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
});
