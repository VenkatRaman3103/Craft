import { pgTable, text, serial } from "drizzle-orm/pg-core";

export const images = pgTable("images", {
    id: serial("id").primaryKey(),
    name: text("name"),
    path: text("path"),
    mimeType: text("mime_type"),
});
