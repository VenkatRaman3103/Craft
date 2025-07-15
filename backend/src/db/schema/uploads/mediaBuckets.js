// # uploads, # media-bucket

import { relations } from "drizzle-orm";
import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { uploads } from "./uploads";

export const mediaBuckets = pgTable("media_buckets", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name"),
    parentId: uuid("parent_id"),
});

// relations one to many relation with uploads
// mediaBuckets |- 1:N -> uploads

export const mediaBucketsRelation = relations(mediaBuckets, ({ many }) => ({
    uploads: many(uploads),
}));
