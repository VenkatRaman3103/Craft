import { relations } from "drizzle-orm";
import { page_items } from "../../pages.js";
import { apiBlocks } from "./schema.js";

export const referenceBlockRelations = relations(apiBlocks, ({ one }) => ({
    page_item: one(page_items, {
        fields: [apiBlocks.block_id],
        references: [page_items.reference_id],
    }),
}));
