import { pgTable, text, uuid } from "drizzle-orm/pg-core";

export const groupsTable = pgTable("groups", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    heading: text("heading"),
});
