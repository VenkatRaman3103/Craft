import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const textFields = pgTable("text_fields", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    value: text("value").notNull(),
    section_id: text("section_id").notNull(),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
});
