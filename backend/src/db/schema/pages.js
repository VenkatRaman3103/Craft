import { relations } from "drizzle-orm";
import { pgTable, uuid, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { multiSelectFields, textFields } from "./fields.js";
import { blocks } from "./blocks.js";

export const pageItemType = pgEnum("page_item_type", [
    "block",
    "text_field",
    "multi_select_field",
]);

export const pages = pgTable("pages", {
    page_id: uuid("page_id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    created_at: timestamp("created_at").defaultNow(),
    edited_at: timestamp("edited_at").defaultNow(),
});

export const page_items = pgTable("page_items", {
    item_id: uuid("item_id").primaryKey().defaultRandom(),
    page_ref_id: uuid("page_ref_id").references(() => pages.page_id, {
        onDelete: "cascade",
    }),
    item_type: pageItemType("item_type").notNull(),
    reference_id: uuid("reference_id").notNull(),
});

export const pageRelation = relations(pages, ({ many }) => ({
    page_items: many(page_items),
}));

export const pageItemsRelation = relations(page_items, ({ one }) => ({
    page: one(pages, {
        fields: [page_items.page_ref_id],
        references: [pages.page_id],
    }),
    text_field: one(textFields, {
        fields: [page_items.reference_id],
        references: [textFields.field_id],
    }),
    multi_select_field: one(multiSelectFields, {
        fields: [page_items.reference_id],
        references: [multiSelectFields.field_id],
    }),
    block: one(blocks, {
        fields: [page_items.reference_id],
        references: [blocks.block_id],
    }),
}));
