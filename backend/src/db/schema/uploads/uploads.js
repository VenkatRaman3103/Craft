import { relations } from "drizzle-orm";
import { pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";
import { mediaBuckets } from "./mediaBuckets.js";

export const uploads = pgTable("uploads", {
    id: uuid("id").primaryKey(),
    name: text("name").notNull(),
    path: text("path").notNull(),
    mimeType: text("mime_type").notNull(),
    mediaBucketId: uuid("media_bucket_id").references(() => mediaBuckets.id, {
        onDelete: "cascade",
    }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// uploads |- many:1 -> mediaBuckets
export const uploadsRelations = relations(uploads, ({ one }) => ({
    mediaBucket: one(mediaBuckets, {
        fields: [uploads.mediaBucketId],
        references: [mediaBuckets.id],
    }),
}));
