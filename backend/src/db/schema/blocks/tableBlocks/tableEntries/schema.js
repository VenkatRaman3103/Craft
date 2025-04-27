import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const tableEntries = pgTable("table_entries", {
    entry_id: uuid("entry_id").primaryKey().defaultRandom(),
    value: text("value").notNull(),
    row_id: uuid("row_id").notNull(),
    column_id: uuid("column_id").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    editedAt: timestamp("edited_at").defaultNow(),
});
