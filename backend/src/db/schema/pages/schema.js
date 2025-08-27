import { pgTable, text, uuid } from "drizzle-orm/pg-core";

export const pagesTable = pgTable("pages", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    sub_page_id: uuid("sub_page_id"),
    slug: text("slug").notNull(),
});
