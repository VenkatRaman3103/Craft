import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { parent } from "./parent.js";

export const child = pgTable("child", {
    child_id: uuid("child_id").defaultRandom().primaryKey().notNull(),
    name: varchar("name").notNull(),
    parent_ref_id: uuid("parent_ref_id").references(() => parent.parent_id),
});
