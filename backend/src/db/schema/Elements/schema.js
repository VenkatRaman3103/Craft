import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const elements = pgTable("elements", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    parent_col_id: text("parent_col_id"),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
});
