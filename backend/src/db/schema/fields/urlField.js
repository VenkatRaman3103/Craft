import { relations } from "drizzle-orm";
import {
    boolean,
    pgEnum,
    pgTable,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";
import { page_items } from "../pages.js";
import { fieldScopeEnums } from "../fieldScopeEnums.js";

export const urlTypeEnum = pgEnum("url_type_enum", ["http", "https"]);

export const urlFields = pgTable("url_fields", {
    field_id: uuid("field_id").primaryKey().defaultRandom(),
    name: varchar("name").notNull(),
    label: varchar("label").notNull(),
    value: varchar("value").notNull(),
    url_type: urlTypeEnum("url_type").default("http"),
    type: varchar("type").default("url").notNull(),
    required: boolean("required").default(false).notNull(),
    scope: fieldScopeEnums("scope").default("page").notNull(),
    description: varchar("description"),
    created_at: timestamp("created_at").defaultNow(),
    edited_at: timestamp("edited_at").defaultNow(),
});

export const urlFieldsRelations = relations(urlFields, ({ one }) => ({
    page_item: one(page_items, {
        fields: [urlFields.field_id],
        references: [page_items.reference_id],
    }),
}));
