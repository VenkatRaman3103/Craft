import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { pages } from "./pages.js";
import { multiSelectFields, singleSelectFields, textFields } from "./fields.js";
import { numberFields } from "./fields/number.js";
import { emailFields } from "./fields/email.js";
import { dateFields } from "./fields/date.js";
import { colorPickerFields } from "./fields/colorPicker.js";
import { textAreaFields } from "./fields/textArea.js";
import { jsonFields } from "./fields/jsonField.js";
import { urlFields } from "./fields/urlField.js";
import { itemType } from "./itemTypeEnum.js";

// const statusEnum = pgEnum("status_enum", ["publish", "unpublish", "draft"]);

export const collections = pgTable("collections", {
    collection_id: uuid("collection_id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    status: text("status").default("draft").notNull(),
    slug: text("slug").notNull(),
    type: text("type"),
    reference_id: text("reference_id"),
    createdAt: timestamp("created_at").defaultNow(),
});

export const collectionItems = pgTable("collection_items", {
    item_id: uuid("collection_item_id").primaryKey().defaultRandom(),
    collection_ref_id: uuid("collection_ref_id")
        .references(() => collections.collection_id, {
            onDelete: "cascade",
        })
        .notNull(),
    item_type: itemType("item_type").notNull(),
    reference_id: uuid("reference_id").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    editedAt: timestamp("edited_at").defaultNow(),
});

export const collectionItemsRelations = relations(
    collectionItems,
    ({ one }) => ({
        collection: one(collections, {
            fields: [collectionItems.collection_ref_id],
            references: [collections.collection_id],
        }),
        page: one(pages, {
            fields: [collectionItems.reference_id],
            references: [pages.page_id],
        }),

        text_field: one(textFields, {
            fields: [collectionItems.reference_id],
            references: [textFields.field_id],
        }),
        multi_select_field: one(multiSelectFields, {
            fields: [collectionItems.reference_id],
            references: [multiSelectFields.field_id],
        }),
        single_select_field: one(singleSelectFields, {
            fields: [collectionItems.reference_id],
            references: [singleSelectFields.field_id],
        }),
        number_field: one(numberFields, {
            fields: [collectionItems.reference_id],
            references: [numberFields.field_id],
        }),
        email_field: one(emailFields, {
            fields: [collectionItems.reference_id],
            references: [emailFields.field_id],
        }),
        date_field: one(dateFields, {
            fields: [collectionItems.reference_id],
            references: [dateFields.field_id],
        }),
        color_picker_field: one(colorPickerFields, {
            fields: [collectionItems.reference_id],
            references: [colorPickerFields.field_id],
        }),
        textarea_field: one(textAreaFields, {
            fields: [collectionItems.reference_id],
            references: [textAreaFields.field_id],
        }),
        json_field: one(jsonFields, {
            fields: [collectionItems.reference_id],
            references: [jsonFields.field_id],
        }),
        url_field: one(urlFields, {
            fields: [collectionItems.reference_id],
            references: [urlFields.field_id],
        }),
    }),
);

export const collectionRelation = relations(collections, ({ many }) => ({
    collection_items: many(collectionItems),
}));
