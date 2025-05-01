import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const referenceBlockItems = pgTable("reference_block_items", {
    item_id: uuid("item_id").primaryKey().defaultRandom(),
    block_id: text("block_id"),
    created_at: timestamp("created_at").defaultNow(),
    edited_at: timestamp("edited_at").defaultNow(),
});
