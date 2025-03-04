import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const parent = pgTable("parent", {
    parent_id: uuid("parent_id").defaultRandom().primaryKey().notNull(),
    name: varchar("name").notNull(),
    created_at: timestamp("created_at").notNull(),
});
