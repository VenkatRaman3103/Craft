import { relations } from "drizzle-orm";
import { arrayBlockItems } from "./schema.js";
import { arrayBlockTemplates } from "../arrayTemplates/schema.js";

export const arrayBlockItemsRelations = relations(
    arrayBlockItems,
    ({ one }) => ({
        // parent: one(arrayBlocks, {
        //     fields: [arrayBlockItems.parent_block_id],
        //     references: [arrayBlocks.block_id],
        // }),
        template_id: one(arrayBlockTemplates, {
            fields: [arrayBlockItems.parent_block_id],
            references: [arrayBlockTemplates.template_id],
        }),
    }),
);
