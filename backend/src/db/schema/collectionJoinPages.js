import { pgTable, uuid, primaryKey } from "drizzle-orm/pg-core";
import { collections } from "./collections.js";
import { pages } from "./pages.js";

export const collectionJoinPages = pgTable(
    "collection_pages",
    {
        collection_ref_id: uuid("collection_ref_id")
            .references(() => collections.collection_id, {
                onDelete: "restrict",
            })
            .notNull(),
        page_ref_id: uuid("page_ref_id")
            .references(() => pages.page_id, { onDelete: "cascade" })
            .notNull(),
    },
    (table) => ({
        pk: primaryKey(table.collection_ref_id, table.page_ref_id),
    }),
);
