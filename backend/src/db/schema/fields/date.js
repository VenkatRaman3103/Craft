import { relations } from "drizzle-orm";
import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { page_items } from "../pages.js";

// date_fields table
export const dateFields = pgTable("date_fields", {
    field_id: uuid("field_id").primaryKey().defaultRandom(),
    name: varchar("name").notNull(),
    label: varchar("label").notNull(),
    value: varchar("value").notNull(),
    type: varchar("type").default("date").notNull(),
    created_at: timestamp("created_at").defaultNow(),
    edited_at: timestamp("edited_at").defaultNow(),
});

export const dateRelations = relations(dateFields, ({ one }) => ({
    page_item: one(page_items, {
        fields: [dateFields.field_id],
        references: [page_items.reference_id],
    }),
}));
