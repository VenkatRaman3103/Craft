import { relations } from "drizzle-orm";
import {
    integer,
    pgTable,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";
import { page_items } from "../pages.js";

// email_fields table
export const emailFields = pgTable("email_fields", {
    field_id: uuid("field_id").primaryKey().defaultRandom(),
    name: varchar("name").notNull(),
    label: varchar("label").notNull(),
    value: integer("value").notNull(),
    type: varchar("type").default("email").notNull(),
    created_at: timestamp("created_at").defaultNow(),
    edited_at: timestamp("edited_at").defaultNow(),
});

export const emailRelations = relations(emailFields, ({ one }) => ({
    page_item: one(page_items, {
        fields: [emailFields.field_id],
        references: [page_items.reference_id],
    }),
}));
