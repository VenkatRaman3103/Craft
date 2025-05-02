import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { scopeEnum } from "../../enums/scopeEnum.js";

export const apiBlocks = pgTable("api_block", {
    block_id: uuid("block_id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("description"),
    url: text("url"),
    response: text("response"),
    scope: scopeEnum("scope").default("global"),
    block_type: text("block_type").default("api").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    editedAt: timestamp("edited_at").defaultNow(),
});
