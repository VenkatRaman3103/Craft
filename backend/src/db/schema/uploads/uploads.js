// # uploads, # media-bucket

import { pgTable, text, uuid } from "drizzle-orm/pg-core";

export const uploads = pgTable("uploads", {
    id: uuid("id").primaryKey(),
    name: text("name"),
    path: text("path"),
    mimeType: text("mime_type"),
});
