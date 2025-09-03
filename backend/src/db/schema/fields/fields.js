import { pgTable, text, unique, uuid } from "drizzle-orm/pg-core";

export const fieldsTable = pgTable(
    "fields",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        name: text("name").notNull(),
        description: text("description"),
        slug: text("slug").notNull(),
        sub_page_id: uuid("sub_field_id"),
        field_type: text("field_type").notNull(),
        field_id: uuid("field_id").notNull(),
    },

    (table) => {
        return {
            slugUnique: unique("fields_slug_unique").on(table.slug),
        };
    },
);
