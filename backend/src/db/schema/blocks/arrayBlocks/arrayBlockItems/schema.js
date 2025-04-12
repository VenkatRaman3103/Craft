import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

// array block items joint table
export const arrayBlockItems = pgTable("array_block_items", {
    item_id: uuid("item_id").primaryKey().defaultRandom(),
    parent_block_id: uuid("parent_block_id").notNull(),
    parent_template_id: uuid("parent_template_id").notNull(),
    item_type: text("item_type").notNull(),
    reference_id: uuid("reference_id").notNull(),
    order: text("order"),
    created_at: timestamp("created_at").defaultNow(),
    edited_at: timestamp("edited_at").defaultNow(),
});
