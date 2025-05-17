import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const screenSizes = pgTable("screen_size", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    heigth: text("heigth").notNull(),
    width: text("width").notNull(),
    created_at: timestamp("created_at").defaultNow(),
    edited_at: timestamp("edited_at").defaultNow(),
});
