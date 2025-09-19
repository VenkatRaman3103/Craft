import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const groups = pgTable("groups", {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    description: text("description"),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
});
