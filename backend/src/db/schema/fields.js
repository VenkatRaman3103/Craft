import { relations } from "drizzle-orm";
import {
    boolean,
    integer,
    pgTable,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";
import { page_items } from "./pages.js";

// TODO: add scope column for each field
// TODO: add scope enum

// text field
export const textFields = pgTable("text_fields", {
    field_id: uuid("field_id").primaryKey().defaultRandom(),
    name: varchar("name").notNull(),
    label: varchar("label").notNull(),
    value: varchar("value").notNull(),
    type: varchar("type").default("text").notNull(),
    created_at: timestamp("created_at").defaultNow(),
    edited_at: timestamp("edited_at").defaultNow(),
});

export const textFieldsRelations = relations(textFields, ({ one }) => ({
    page_item: one(page_items, {
        fields: [textFields.field_id],
        references: [page_items.reference_id],
    }),
}));

// multi select field
export const multiSelectFields = pgTable("multi_select_fields", {
    field_id: uuid("field_id").primaryKey().defaultRandom(),
    name: varchar("name").notNull(),
    label: varchar("label").notNull(),
    type: varchar("type").default("multi_select").notNull(),
    created_at: timestamp("created_at").defaultNow(),
    edited_at: timestamp("edited_at").defaultNow(),
});

export const multiSelectOptions = pgTable("multi_select_options", {
    option_id: uuid("option_id").primaryKey().defaultRandom(),
    field_id: uuid("field_id")
        .notNull()
        .references(() => multiSelectFields.field_id, { onDelete: "cascade" }),
    label: varchar("label").notNull(),
    value: varchar("value").notNull(),
    is_selected: boolean("is_selected").default(false).notNull(),
    order: integer("display_order").notNull(),
    created_at: timestamp("created_at").defaultNow(),
    edited_at: timestamp("edited_at").defaultNow(),
});

export const multiSelectFieldsRelations = relations(
    multiSelectFields,
    ({ one, many }) => ({
        page_item: one(page_items, {
            fields: [multiSelectFields.field_id],
            references: [page_items.reference_id],
        }),
        options: many(multiSelectOptions),
    }),
);

export const multiSelectOptionsRelations = relations(
    multiSelectOptions,
    ({ one }) => ({
        field: one(multiSelectFields, {
            fields: [multiSelectOptions.field_id],
            references: [multiSelectFields.field_id],
        }),
    }),
);

// single select field
export const singleSelectFields = pgTable("single_select_fields", {
    field_id: uuid("field_id").primaryKey().defaultRandom(),
    name: varchar("name").notNull(),
    label: varchar("label").notNull(),
    type: varchar("type").default("single_select").notNull(),
    created_at: timestamp("created_at").defaultNow(),
    edited_at: timestamp("edited_at").defaultNow(),
});

export const singleSelectOptions = pgTable("single_select_options", {
    option_id: uuid("option_id").primaryKey().defaultRandom(),
    field_id: uuid("field_id")
        .notNull()
        .references(() => singleSelectFields.field_id, { onDelete: "cascade" }),
    label: varchar("label").notNull(),
    value: varchar("value").notNull(),
    is_selected: boolean("is_selected").default(false).notNull(),
    order: integer("display_order").notNull(),
    created_at: timestamp("created_at").defaultNow(),
    edited_at: timestamp("edited_at").defaultNow(),
});

export const singleSelectFieldsRelations = relations(
    singleSelectFields,
    ({ one, many }) => ({
        page_item: one(page_items, {
            fields: [singleSelectFields.field_id],
            references: [page_items.reference_id],
        }),
        options: many(singleSelectOptions),
    }),
);

export const singleSelectOptionsRelations = relations(
    singleSelectOptions,
    ({ one }) => ({
        field: one(singleSelectFields, {
            fields: [singleSelectOptions.field_id],
            references: [singleSelectFields.field_id],
        }),
    }),
);
