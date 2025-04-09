import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { page_items } from "./pages.js";
import { scopeEnum } from "./enums/scopeEnum.js";

// normal block
export const blocks = pgTable("blocks", {
    block_id: uuid("block_id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("description"),
    scope: scopeEnum("scope").default("global"),
    block_type: text("block_type").default("normal").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    editedAt: timestamp("edited_at").defaultNow(),
});

export const block_items = pgTable("block_items", {
    ntem_id: uuid("item_id").primaryKey().defaultRandom(),
    parent_block_id: uuid("parent_block_id").notNull(),
    item_type: text("item_type").notNull(),
    reference_id: uuid("reference_id").notNull(),
    order: text("order"),
    created_at: timestamp("created_at").defaultNow(),
    edited_at: timestamp("edited_at").defaultNow(),
});

export const blocksRelations = relations(blocks, ({ one, many }) => ({
    page_item: one(page_items, {
        fields: [blocks.block_id],
        references: [page_items.reference_id],
    }),
    block_item: many(block_items),
}));

// TODO: change the parent_block_id to generic name
export const blockItemsRelations = relations(block_items, ({ one }) => ({
    // A block item belongs to a parent block
    parent: one(blocks, {
        fields: [block_items.parent_block_id],
        references: [blocks.block_id],
    }),
}));
