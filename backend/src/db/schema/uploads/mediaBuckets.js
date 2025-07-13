// # uploads, # media-bucket

import { pgTable, text, uuid } from "drizzle-orm/pg-core";

export const mediaBuckets = pgTable("media_buckets", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name"),
    parentId: uuid("parent_id"),
});
