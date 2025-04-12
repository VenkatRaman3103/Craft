import { response } from "express";
import { arrayBlockItems } from "../../../../db/schema/blocks/arrayBlocks/arrayBlockItems/schema.js";
import { arrayBlockTemplates } from "../../../../db/schema/blocks/arrayBlocks/arrayTemplates/schema.js";
import { db } from "../../../server.js";
import { blocks } from "../../../../db/schema/blocks.js";

export async function createArrayTemplate(req, res) {
    const { name, array_block_id, array_block_item_id } = req.body;

    try {
        const response = await db.insert(arrayBlockTemplates).values([
            {
                name,
                array_block_id,
                array_block_item_id,
            },
        ]);
        res.json(response);
    } catch (error) {
        const errorMessage = {
            error: error.message,
            origin: "backend/arrayBlocks/createArrayTemplate/POST",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
}

export async function duplicateTheTemplate(req, res) {
    const { template_id } = req.params;

    async function duplicateBlockItems(newTemplate, blockItems) {
        const response = await Promise.all(
            blockItems.map(async (blockItem) => {
                const blockTemplate = await db.query.blocks.findFirst({
                    where: (blocks, { eq }) =>
                        eq(blocks.block_id, blockItem.reference_id),
                });

                const [newBlock] = await db
                    .insert(blocks)
                    .values([
                        {
                            name: blockTemplate.name,
                            description: blockTemplate.description,
                            scope: blockTemplate.scope,
                            block_type: blockTemplate.block_type,
                        },
                    ])
                    .returning();

                await db.insert(arrayBlockItems).values([
                    {
                        parent_block_id: newTemplate.array_block_id,
                        parent_template_id: newTemplate.template_id,
                        item_type: "normal",
                        reference_id: newBlock.block_id,
                        order: "1",
                    },
                ]);

                return newBlock;
            }),
        );

        return response;
    }

    try {
        const template = await db.query.arrayBlockTemplates.findFirst({
            where: (arrayBlockTemplates, { eq }) =>
                eq(arrayBlockTemplates.template_id, template_id),
        });

        console.log(template, "response");

        const blockItems = await db.query.arrayBlockItems.findMany({
            where: (arrayBlockItems, { eq }) =>
                eq(arrayBlockItems.parent_template_id, template.template_id),
        });

        // duplicate the template
        const [newTemplate] = await db
            .insert(arrayBlockTemplates)
            .values([
                {
                    name: "duplicate 2",
                    array_block_id: template.array_block_id,
                    array_block_item_id: template.array_block_item_id,
                },
            ])
            .returning();

        // duplicate the blockItems
        const duplicates = duplicateBlockItems(newTemplate, blockItems);

        const actualBlocks = await Promise.all(
            blockItems.map((blockItem) => {
                const block = db.query.blocks.findFirst({
                    where: (blocks, { eq }) =>
                        eq(blocks.block_id, blockItem.reference_id),
                });
                return block;
            }),
        );

        res.json(duplicates);
    } catch (error) {
        const errorMessage = {
            error: error.message,
            origin: "backend/arrayBlocks/duplicateTheTemplate/POST",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
}
