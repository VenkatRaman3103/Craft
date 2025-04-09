import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const arrayBlockTemplates = pgTable("array_block_templates", {
    template_id: uuid("template_id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow(),
    editedAt: timestamp("edited_at").defaultNow(),
    // for relations
    array_block_id: text("array_block_id"),
    array_block_item_id: uuid("array_block_item_id"),
});
