import { relations } from "drizzle-orm";
// import { page_items } from "./pages.js";
import { page_items } from "../../pages.js";
import { referenceBlock } from "./schema.js";

export const referenceBlockRelations = relations(referenceBlock, ({ one }) => ({
    page_item: one(page_items, {
        fields: [referenceBlock.block_id],
        references: [page_items.reference_id],
    }),
}));
