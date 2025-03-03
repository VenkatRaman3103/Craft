import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const blocks = pgTable("blocks", {
    block_id: uuid("block_id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("content").notNull(),
    scope: text("scope").default(null), // TODO: enum: "global", "page", "collection"
    reference_id: text("reference_id").default(null),
    createdAt: timestamp("created_at").defaultNow(),
    editedAt: timestamp("edited_at").defaultNow(),
});
