import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const tableColumns = pgTable("table_columns", {
    column_id: uuid("column_id").primaryKey().defaultRandom(),
    value: text("value").notNull(),
    table_id: uuid("table_id").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    editedAt: timestamp("edited_at").defaultNow(),
});
