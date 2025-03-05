import { relations } from "drizzle-orm";
import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { page_items } from "./pages.js";

export const scopeEnum = pgEnum("scope_enum", ["global", "page", "collection"]);

export const blocks = pgTable("blocks", {
    block_id: uuid("block_id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("content").notNull(),
    scope: scopeEnum("scope").default("global"),
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
