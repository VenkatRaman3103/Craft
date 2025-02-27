import { relations } from "drizzle-orm";
import {
    pgTable,
    uuid,
    text,
    timestamp,
    varchar,
    integer,
    boolean,
    jsonb,
} from "drizzle-orm/pg-core";

export const pages = pgTable("pages", {
    page_id: uuid("page_id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    created_at: timestamp("created_at").defaultNow(),
    edited_at: timestamp("edited_at").defaultNow(),
});

export const blocks = pgTable("blocks", {
    block_id: uuid("block_id").primaryKey().defaultRandom(),
    page_id: uuid("page_id")
        .notNull()
        .references(() => pages.page_id, { onDelete: "cascade" }),
    block_type_id: uuid("block_type_id")
        .notNull()
        .references(() => blockTypes.block_type_id),
    order: integer("order").notNull(),
});

export const blockTypes = pgTable("block_types", {
    block_type_id: uuid("block_type_id").primaryKey().defaultRandom(),
    name: varchar("name").notNull(),
});

export const fieldDefinitions = pgTable("field_definitions", {
    field_def_id: uuid("field_def_id").primaryKey().defaultRandom(),
    block_type_id: uuid("block_type_id")
        .notNull()
        .references(() => blockTypes.block_type_id, { onDelete: "cascade" }),
    name: varchar("name").notNull(),
    label: varchar("label").notNull(),
    type: varchar("type").notNull(),
    required: boolean("required").default(false),
    default_value: jsonb("default_value"),
    options: jsonb("options"),
    order: integer("order").notNull(),
});

export const fieldValues = pgTable("field_values", {
    field_value_id: uuid("field_value_id").primaryKey().defaultRandom(),
    block_id: uuid("block_id")
        .notNull()
        .references(() => blocks.block_id, { onDelete: "cascade" }),
    field_def_id: uuid("field_def_id")
        .notNull()
        .references(() => fieldDefinitions.field_def_id),
    value: jsonb("value").notNull(),
});

export const pagesRelations = relations(pages, ({ many }) => ({
    blocks: many(blocks),
}));

export const blocksRelations = relations(blocks, ({ one, many }) => ({
    page: one(pages, {
        fields: [blocks.page_id],
        references: [pages.page_id],
    }),
    blockType: one(blockTypes, {
        fields: [blocks.block_type_id],
        references: [blockTypes.block_type_id],
    }),
    fieldValues: many(fieldValues),
}));

export const blockTypesRelations = relations(blockTypes, ({ many }) => ({
    fieldDefinitions: many(fieldDefinitions),
    blocks: many(blocks),
}));

export const fieldDefinitionsRelations = relations(
    fieldDefinitions,
    ({ one, many }) => ({
        blockType: one(blockTypes, {
            fields: [fieldDefinitions.block_type_id],
            references: [blockTypes.block_type_id],
        }),
        fieldValues: many(fieldValues),
    }),
);

export const fieldValuesRelations = relations(fieldValues, ({ one }) => ({
    block: one(blocks, {
        fields: [fieldValues.block_id],
        references: [blocks.block_id],
    }),
    fieldDefinition: one(fieldDefinitions, {
        fields: [fieldValues.field_def_id],
        references: [fieldDefinitions.field_def_id],
    }),
}));
