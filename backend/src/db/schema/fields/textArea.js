import { relations } from "drizzle-orm";
import {
    boolean,
    pgTable,
    text,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";
import { page_items } from "../pages.js";
import { fieldScopeEnums } from "../fieldScopeEnums.js";
import { collectionItems } from "../collections.js";

export const textAreaFields = pgTable("textarea_fields", {
    field_id: uuid("field_id").primaryKey().defaultRandom(),
    name: varchar("name").notNull(),
    label: varchar("label").notNull(),
    value: text("value").notNull(),
    type: varchar("type").default("textarea").notNull(),
    required: boolean("required").default(false).notNull(),
    scope: fieldScopeEnums("scope").default("page").notNull(),
    description: varchar("description"),
    created_at: timestamp("created_at").defaultNow(),
    edited_at: timestamp("edited_at").defaultNow(),
});

export const textFieldsRelations = relations(textAreaFields, ({ one }) => ({
    page_item: one(page_items, {
        fields: [textAreaFields.field_id],
        references: [page_items.reference_id],
    }),
    collection_item: one(collectionItems, {
        fields: [textAreaFields.field_id],
        references: [collectionItems.reference_id],
    }),
}));
