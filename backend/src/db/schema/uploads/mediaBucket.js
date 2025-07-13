// # uploads, # media-bucket

import { pgTable, text, uuid } from "drizzle-orm/pg-core";

export const mediaBucket = pgTable("media_bucket", {
    id: uuid("id").primaryKey(),
    name: text("name"),
    path: text("path"),
    mimeType: text("mime_type"),
});
