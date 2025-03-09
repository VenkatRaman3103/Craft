import { relations } from "drizzle-orm";
import { pgTable, uuid, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { multiSelectFields, singleSelectFields, textFields } from "./fields.js";
import { blocks } from "./blocks.js";
import { numberFields } from "./fields/number.js";
import { emailFields } from "./fields/email.js";
import { dateFields } from "./fields/date.js";
import { colorPickerFields } from "./fields/colorPicker.js";

export const pageItemType = pgEnum("item_type", [
    "block",
    "text_field",
    "multi_select_field",
    "single_select_field",
    "number_field",
    "email_field",
    "date_field",
    "color_picker_field",
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
    single_select_field: one(singleSelectFields, {
        fields: [page_items.reference_id],
        references: [singleSelectFields.field_id],
    }),
    number_field: one(numberFields, {
        fields: [page_items.reference_id],
        references: [numberFields.field_id],
    }),
    email_field: one(emailFields, {
        fields: [page_items.reference_id],
        references: [emailFields.field_id],
    }),
    date_field: one(dateFields, {
        fields: [page_items.reference_id],
        references: [dateFields.field_id],
    }),
    color_picker_field: one(colorPickerFields, {
        fields: [page_items.reference_id],
        references: [colorPickerFields.field_id], // Make sure this matches
    }),
    block: one(blocks, {
        fields: [page_items.reference_id],
        references: [blocks.block_id],
    }),
}));
