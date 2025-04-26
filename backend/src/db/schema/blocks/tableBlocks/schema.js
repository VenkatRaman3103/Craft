import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { scopeEnum } from "../../enums/scopeEnum.js";

export const tableBlocks = pgTable("table_blocks", {
    block_id: uuid("block_id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("content"),
    scope: scopeEnum("scope").default("global"),
    block_type: text("block_type").default("table").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    editedAt: timestamp("edited_at").defaultNow(),
});
