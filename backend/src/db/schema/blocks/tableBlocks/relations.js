import { relations } from "drizzle-orm";
import { tableBlocks } from "./schema";
import { page_items } from "../../pages";

export const tableRelations = relations(tableBlocks, ({ one }) => ({
    page_items: one(page_items, {
        fields: [tableBlocks.block_id],
        references: [page_items.reference_id],
    }),
}));
