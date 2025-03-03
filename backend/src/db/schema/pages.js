import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const pages = pgTable("pages", {
    page_id: uuid("page_id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    created_at: timestamp("created_at").defaultNow(),
    edited_at: timestamp("edited_at").defaultNow(),
});
