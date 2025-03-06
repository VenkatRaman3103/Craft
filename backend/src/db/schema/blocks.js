import { relations } from "drizzle-orm";
import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { page_items } from "./pages.js";

export const scopeEnum = pgEnum("scope_enum", ["global", "page", "collection"]);

// normal block
export const blocks = pgTable("blocks", {
    block_id: uuid("block_id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("content").notNull(),
    scope: scopeEnum("scope").default("global"),
    block_type: text("block_type").default("normal").notNull(),
    reference_id: text("reference_id").default(null),
    createdAt: timestamp("created_at").defaultNow(),
    editedAt: timestamp("edited_at").defaultNow(),
});

export const blocksRelations = relations(blocks, ({ one }) => ({
    page_item: one(page_items, {
        fields: [blocks.block_id],
        references: [page_items.reference_id],
    }),
}));

// array block
export const arrayBlocks = pgTable("array_blocks", {
    block_id: uuid("block_id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("content").notNull(),
    scope: scopeEnum("scope").default("global"),
    block_type: text("block_type").default("array").notNull(),
    reference_id: text("reference_id").default(null), // based on the scope
    createdAt: timestamp("created_at").defaultNow(),
    editedAt: timestamp("edited_at").defaultNow(),
});

// array block items joint table
export const arrayBlockItems = pgTable("array_block_items", {
    item_id: uuid("item_id").primaryKey().defaultRandom(),
    array_block_ref_id: uuid("array_block_ref_id").references(
        () => arrayBlocks.block_id,
        {
            onDelete: "cascade",
        },
    ),
    item_type: text("item_type").notNull(),
    reference_id: uuid("reference_id").notNull(), // connected to blocks table (based on the scope: global)
});
