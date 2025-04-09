import { relations } from "drizzle-orm";
// import { page_items } from "./pages.js";
import { arrayBlocks } from "./schema.js";
import { page_items } from "../../pages.js";

export const arrayBlocksRelations = relations(arrayBlocks, ({ one }) => ({
    page_item: one(page_items, {
        fields: [arrayBlocks.block_id],
        references: [page_items.reference_id],
    }),
}));
