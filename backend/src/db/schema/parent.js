import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { child } from "./child.js";
import { relations } from "drizzle-orm";

export const parent = pgTable("parent", {
    parent_id: uuid("parent_id").defaultRandom().primaryKey().notNull(),
    name: varchar("name").notNull(),
    created_at: timestamp("created_at").defaultNow(),
});

export const parentRelation = relations(parent, ({ many }) => ({
    children: many(child),
}));
