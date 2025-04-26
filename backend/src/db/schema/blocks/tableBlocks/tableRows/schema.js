import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const tableRows = pgTable("table_rows", {
    row_id: uuid("row_id").primaryKey().defaultRandom(),
    value: text("value").notNull(),
    column_id: uuid("column_id").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    editedAt: timestamp("edited_at").defaultNow(),
});
