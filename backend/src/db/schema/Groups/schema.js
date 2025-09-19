import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const groups = pgTable("groups", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
});
