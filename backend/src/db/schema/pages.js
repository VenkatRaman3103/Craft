import { relations } from "drizzle-orm";
import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { multiSelectFields, singleSelectFields, textFields } from "./fields.js";
import { numberFields } from "./fields/number.js";
import { emailFields } from "./fields/email.js";
import { dateFields } from "./fields/date.js";
import { colorPickerFields } from "./fields/colorPicker.js";
import { textAreaFields } from "./fields/textArea.js";
import { jsonFields } from "./fields/jsonField.js";
import { urlFields } from "./fields/urlField.js";
import { collectionItems } from "./collections.js";
import { itemType } from "./itemTypeEnum.js";
import { blocks } from "./blocks.js";
import { arrayBlocks } from "./blocks/arrayBlocks/schema.js";
import { tableBlocks } from "./blocks/tableBlocks/schema.js";
import { referenceBlock } from "./blocks/referenceBlock/schema.js";

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
    item_type: itemType("item_type").notNull(),
    reference_id: uuid("reference_id").notNull(),
});

export const pageRelation = relations(pages, ({ one, many }) => ({
    page_items: many(page_items),
    collection_item: one(collectionItems, {
        fields: [pages.page_id],
        references: [collectionItems.reference_id],
    }),
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
        references: [colorPickerFields.field_id],
    }),
    textarea_field: one(textAreaFields, {
        fields: [page_items.reference_id],
        references: [textAreaFields.field_id],
    }),
    json_field: one(jsonFields, {
        fields: [page_items.reference_id],
        references: [jsonFields.field_id],
    }),
    url_field: one(urlFields, {
        fields: [page_items.reference_id],
        references: [urlFields.field_id],
    }),
    normal: one(blocks, {
        fields: [page_items.reference_id],
        references: [blocks.block_id],
    }),
    array: one(arrayBlocks, {
        fields: [page_items.reference_id],
        references: [arrayBlocks.block_id],
    }),
    table: one(tableBlocks, {
        fields: [page_items.reference_id],
        references: [tableBlocks.block_id],
    }),
    reference: one(referenceBlock, {
        fields: [page_items.reference_id],
        references: [referenceBlock.block_id],
    }),
}));
