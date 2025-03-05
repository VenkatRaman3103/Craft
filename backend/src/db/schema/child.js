import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { parent } from "./parent.js";
import { relations } from "drizzle-orm";

export const child = pgTable("child", {
    child_id: uuid("child_id").defaultRandom().primaryKey().notNull(),
    name: varchar("name").notNull(),
    parent_ref_id: uuid("parent_ref_id").references(() => parent.parent_id),
    created_at: timestamp("created_at").defaultNow(),
});

export const childRelation = relations(child, ({ one }) => ({
    parent: one(parent, {
        fields: [child.parent_ref_id],
        references: [parent.parent_id],
    }),
}));
