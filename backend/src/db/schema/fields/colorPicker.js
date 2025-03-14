import { relations } from "drizzle-orm";
import {
    pgTable,
    timestamp,
    uuid,
    varchar,
    jsonb,
    boolean,
} from "drizzle-orm/pg-core";
import { page_items } from "../pages.js";
import { fieldScopeEnums } from "../fieldScopeEnums.js";

export const colorPickerFields = pgTable("color_picker_fields", {
    field_id: uuid("field_id").primaryKey().defaultRandom(),
    hex: varchar("hex", { length: 7 }).notNull(),
    rgb: jsonb("rgb").notNull(),
    rgba: jsonb("rgba").notNull(),
    hsl: jsonb("hsl").notNull(),
    hsla: jsonb("hsla").notNull(),
    name: varchar("name").notNull(),
    label: varchar("label").notNull(),
    value: varchar("value", { length: 7 }).notNull(),
    required: boolean("required").default(false).notNull(),
    scope: fieldScopeEnums("scope").default("page").notNull(),
    description: varchar("description"),
    type: varchar("type").default("colorPicker").notNull(),
    created_at: timestamp("created_at").defaultNow(),
    edited_at: timestamp("edited_at").defaultNow(),
});

export const colorRelations = relations(colorPickerFields, ({ one }) => ({
    page_item: one(page_items, {
        fields: [colorPickerFields.field_id],
        references: [page_items.reference_id],
    }),
}));
