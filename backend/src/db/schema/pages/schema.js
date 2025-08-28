import { pgTable, text, unique, uuid } from "drizzle-orm/pg-core";

export const pagesTable = pgTable(
    "pages",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        name: text("name").notNull(),
        description: text("description"),
        slug: text("slug").notNull(),
        sub_page_id: uuid("sub_page_id"),
    },

    (table) => {
        return {
            slugUnique: unique("pages_slug_unique").on(table.slug),
        };
    },
);
