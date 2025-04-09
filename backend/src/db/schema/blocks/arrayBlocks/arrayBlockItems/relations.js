import { relations } from "drizzle-orm";
import { arrayBlockItems } from "./schema.js";
import { arrayBlocks } from "../schema.js";

export const arrayBlockItemsRelations = relations(
    arrayBlockItems,
    ({ one }) => ({
        parent: one(arrayBlocks, {
            fields: [arrayBlockItems.parent_block_id],
            references: [arrayBlocks.block_id],
        }),
    }),
);
