import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

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
