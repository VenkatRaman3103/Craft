import { pgTable, uuid, text } from "drizzle-orm/pg-core";

export const pages = pgTable("pages", {
    page_id: uuid("page_id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
});
