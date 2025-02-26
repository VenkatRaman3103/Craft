import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

// const statusEnum = pgEnum("status_enum", ["publish", "unpublish", "draft"]);

export const collections = pgTable("collections", {
    collection_id: uuid("collection_id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    status: text("status").default("draft").notNull(),
    slug: text("slug").notNull(),
    type: text("type"),
    reference_id: text("reference_id"),
    createdAt: timestamp("created_at").defaultNow(),
});
