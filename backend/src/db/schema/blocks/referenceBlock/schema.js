import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { scopeEnum } from "../../enums/scopeEnum.js";

export const referenceBlock = pgTable("reference_blocks", {
    block_id: uuid("block_id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    reference_type: text("reference_type").default("reference").notNull(),
    collection_id: text("collection_id"),
    description: text("content"),
    scope: scopeEnum("scope").default("global"),
    createdAt: timestamp("created_at").defaultNow(),
    editedAt: timestamp("edited_at").defaultNow(),
});
