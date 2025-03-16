import { relations } from "drizzle-orm";
import {
    boolean,
    jsonb,
    pgTable,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";
import { page_items } from "../pages.js";
import { fieldScopeEnums } from "../fieldScopeEnums.js";
import { collectionItems } from "../collections.js";

export const jsonFields = pgTable("json_fields", {
    field_id: uuid("field_id").primaryKey().defaultRandom(),
    name: varchar("name").notNull(),
    label: varchar("label").notNull(),
    value: jsonb("value").notNull(),
    type: varchar("type").default("json_fields").notNull(),
    required: boolean("required").default(false).notNull(),
    scope: fieldScopeEnums("scope").default("page").notNull(),
    description: varchar("description"),
    created_at: timestamp("created_at").defaultNow(),
    edited_at: timestamp("edited_at").defaultNow(),
});

export const jsonRelations = relations(jsonFields, ({ one }) => ({
    page_item: one(page_items, {
        fields: [jsonFields.field_id],
        references: [page_items.reference_id],
    }),
    collection_item: one(collectionItems, {
        fields: [jsonFields.field_id],
        references: [collectionItems.reference_id],
    }),
}));
