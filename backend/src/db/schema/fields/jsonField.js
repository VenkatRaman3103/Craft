import { relations } from "drizzle-orm";
import { jsonb, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { page_items } from "../pages.js";

export const jsonFields = pgTable("json_fields", {
    field_id: uuid("field_id").primaryKey().defaultRandom(),
    name: varchar("name").notNull(),
    label: varchar("label").notNull(),
    value: jsonb("value").notNull(),
    type: varchar("type").default("json_fields").notNull(),
    created_at: timestamp("created_at").defaultNow(),
    edited_at: timestamp("edited_at").defaultNow(),
});

export const jsonRelations = relations(jsonFields, ({ one }) => ({
    page_item: one(page_items, {
        fields: [jsonFields.field_id],
        references: [page_items.reference_id],
    }),
}));
