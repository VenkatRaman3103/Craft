import { relations } from "drizzle-orm";
import { pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";
import { uploads } from "./uploads.js";

export const mediaBuckets = pgTable("media_buckets", {
    id: uuid("id").primaryKey(),
    name: text("name").notNull(),
    parentId: uuid("parent_id"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// mediaBuckets |- many:1 -> mediaBuckets (parent)
// mediaBuckets |- 1:many -> mediaBuckets (children)
export const mediaBucketsRelations = relations(
    mediaBuckets,
    ({ one, many }) => ({
        parent: one(mediaBuckets, {
            fields: [mediaBuckets.parentId],
            references: [mediaBuckets.id],
            relationName: "parent_child",
        }),
        children: many(mediaBuckets, {
            relationName: "parent_child",
        }),
        uploads: many(uploads),
    }),
);
