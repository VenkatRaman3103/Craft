import { pgTable, text, timestamp, serial } from "drizzle-orm/pg-core";

export const collections = pgTable("collections", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    status: text("status").notNull(),
    slug: text("slug").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});
