import { pgTable, text, timestamp, uuid, pgEnum } from "drizzle-orm/pg-core";

const statusEnum = pgEnum("status_enum", ["publish", "unpublish", "draft"]);

export const collections = pgTable("collections", {
    collection_id: uuid("collection_id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    status: statusEnum("status").notNull(),
    slug: text("slug").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});
