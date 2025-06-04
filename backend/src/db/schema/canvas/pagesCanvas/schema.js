import { pgTable, text, uuid } from "drizzle-orm/pg-core";

export const pagesCanvas = pgTable("pages_canvas", {
    page_id: uuid("page_id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    status: text("status"),
});
