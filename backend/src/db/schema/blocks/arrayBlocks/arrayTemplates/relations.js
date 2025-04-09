import { relations } from "drizzle-orm";
import { arrayBlockTemplates } from "./schema.js";
import { arrayBlocks } from "../schema.js";
import { arrayBlockItems } from "../arrayBlockItems/schema.js";

export const arrayTemplatesRelations = relations(
    arrayBlockTemplates,
    ({ one }) => ({
        array_block: one(arrayBlocks, {
            fields: [arrayBlockTemplates.array_block_id],
            references: [arrayBlocks.block_id],
        }),
        array_block_item: one(arrayBlockItems, {
            fields: [arrayBlockTemplates.array_block_item_id],
            references: [arrayBlockItems.item_id],
        }),
    }),
);
