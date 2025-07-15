// # uploads, # media-bucket

import { relations } from "drizzle-orm";
import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { mediaBuckets } from "./mediaBuckets";

export const uploads = pgTable("uploads", {
    id: uuid("id").primaryKey(),
    name: text("name"),
    path: text("path"),
    mimeType: text("mime_type"),
    mediaBucketId: uuid("media_bucket_id").references(() => mediaBuckets.id),
});

// relations one to one relation with mediaBuckets
// uploads |- 1:1 ->mediaBuckets

export const uploadsRelations = relations(uploads, ({ one }) => ({
    mediaBuckets: one(uploads, {
        fields: [uploads.id],
        references: [mediaBuckets.id],
    }),
}));
