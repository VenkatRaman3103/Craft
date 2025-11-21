import { jsonb, pgTable, text, uuid } from "drizzle-orm/pg-core";

export const pages_versions = pgTable("pages_versions", {
    id: uuid("id").defaultRandom().primaryKey(),
    page_id: text("page_id").notNull(),
    content_json: jsonb("content_json").notNull(),
    published_at: text("published_at").notNull(),
    created_by: text("created_by").notNull(),
});
