import { response } from "express";
import { arrayBlockItems } from "../../../../db/schema/blocks/arrayBlocks/arrayBlockItems/schema.js";
import { arrayBlockTemplates } from "../../../../db/schema/blocks/arrayBlocks/arrayTemplates/schema.js";
import { db } from "../../../server.js";
import { block_items, blocks } from "../../../../db/schema/blocks.js";
import { arrayBlocks } from "../../../../db/schema/index.js";

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
                console.log(blockItem, "blockItems");

                let parentBlock;

                if (blockItem.item_type == "normal") {
                    parentBlock = await db.query.blocks.findFirst({
                        where: (blocks, { eq }) =>
                            eq(blocks.block_id, blockItem.reference_id),
                    });
                } else if (blockItem.item_type == "array") {
                    parentBlock = await db.query.arrayBlocks.findFirst({
                        where: (arrayBlocks, { eq }) =>
                            eq(arrayBlocks.block_id, blockItem.reference_id),
                    });
                }

                console.log(parentBlock, "parentBlock");

                let childrenBlockItems;

                if (parentBlock.block_type == "normal") {
                    childrenBlockItems = await db.query.block_items.findMany({
                        where: (block_items, { eq }) =>
                            eq(
                                block_items.parent_block_id,
                                parentBlock.block_id,
                            ),
                    });
                } else if (parentBlock.block_type == "array") {
                    childrenBlockItems =
                        await db.query.arrayBlockItems.findMany({
                            where: (arrayBlockItems, { eq }) =>
                                eq(
                                    arrayBlockItems.parent_block_id,
                                    parentBlock.block_id,
                                ),
                        });
                }

                console.log(childrenBlockItems, "childrenBlockItems");

                if (!childrenBlockItems) {
                    return;
                }

                let childrenBlocks;

                if (parentBlock.block_type == "normal") {
                    childrenBlocks = await Promise.all(
                        childrenBlockItems.map(async (child) => {
                            return await db.query.blocks.findFirst({
                                where: (blocks, { eq }) =>
                                    eq(blocks.block_id, child.reference_id),
                            });
                        }),
                    );
                } else if (parentBlock.block_type == "array") {
                    childrenBlocks = await Promise.all(
                        childrenBlockItems.map(async (child) => {
                            return await db.query.arrayBlocks.findFirst({
                                where: (arrayBlocks, { eq }) =>
                                    eq(
                                        arrayBlocks.block_id,
                                        child.reference_id,
                                    ),
                            });
                        }),
                    );
                }

                console.log(childrenBlocks, "childrenBlocks-1");

                if (parentBlock) {
                    let newParent;

                    if (parentBlock.block_type == "normal") {
                        // clone the parent
                        // creating a new block in blocks table
                        const [temp] = await db
                            .insert(blocks)
                            .values([
                                {
                                    name: parentBlock.name,
                                    block_type: parentBlock.block_type,
                                    description: parentBlock.description,
                                },
                            ])
                            .returning();
                        newParent = temp;
                    } else if (parentBlock.block_type == "array") {
                        const [temp] = await db
                            .insert(arrayBlocks)
                            .values([
                                {
                                    name: parentBlock.name,
                                    block_type: parentBlock.block_type,
                                    description: parentBlock.description,
                                },
                            ])
                            .returning();
                        newParent = temp;
                    }

                    console.log(
                        newParent,
                        newTemplate.template_id,
                        "newParent",
                    );

                    if (newParent.block_type == "normal") {
                        // creating a new blockItem in arrayBlockItems
                        await db.insert(arrayBlockItems).values([
                            {
                                parent_block_id: newParent.block_id,
                                parent_template_id: newTemplate.template_id,
                                reference_id: newParent.block_id,
                                item_type: newParent.block_type,
                            },
                        ]);
                    } else if (newParent.block_type == "array") {
                        // creating a new blockItem in arrayBlockItems
                        await db.insert(arrayBlockItems).values([
                            {
                                parent_block_id: newTemplate.array_block_id,
                                parent_template_id: newTemplate.template_id,
                                reference_id: newParent.block_id,
                                item_type: newParent.block_type,
                            },
                        ]);
                    }

                    console.log(childrenBlocks[0], "childrenBlocks-2");

                    const templateOfChild =
                        await db.query.arrayBlockTemplates.findMany({
                            where: (arrayBlockTemplates, { eq }) =>
                                eq(
                                    arrayBlockTemplates.array_block_id,
                                    parentBlock.block_id,
                                ),
                        });

                    console.log(templateOfChild, "templateOfChild");

                    const uuidGen = "79adb833-5a0e-492a-8151-e5d77e07c445";

                    // check
                    const [createTemplates] = await Promise.all(
                        templateOfChild.map(async (item) => {
                            const [newTemplateRef] = await db
                                .insert(arrayBlockTemplates)
                                .values([
                                    {
                                        name: item.name,
                                        array_block_item_id: uuidGen,
                                        array_block_id: newParent.block_id,
                                    },
                                ])
                                .returning();

                            console.log(newTemplateRef, "newTemplateRef");

                            const childrenBlockItems =
                                await db.query.arrayBlockItems.findMany({
                                    where: (arrayBlockItems, { eq }) =>
                                        eq(
                                            arrayBlockItems.parent_template_id,
                                            item.template_id,
                                        ),
                                });

                            const actualBlocksOfTemplates = [];

                            await Promise.all(
                                childrenBlockItems.map(async (item) => {
                                    if (item.item_type == "normal") {
                                        const temp =
                                            await db.query.blocks.findFirst({
                                                where: (blocks, { eq }) =>
                                                    eq(
                                                        blocks.block_id,
                                                        item.reference_id,
                                                    ),
                                            });

                                        console.log(temp, "temp <-----");
                                        actualBlocksOfTemplates.push(temp);
                                    } else if (item.item_type == "array") {
                                        const temp =
                                            await db.query.arrayBlocks.findFirst(
                                                {
                                                    where: (
                                                        arrayBlocks,
                                                        { eq },
                                                    ) =>
                                                        eq(
                                                            arrayBlocks.block_id,
                                                            item.reference_id,
                                                        ),
                                                },
                                            );
                                        console.log(temp, "temp <-----");
                                        actualBlocksOfTemplates.push(temp);
                                    }
                                }),
                            );

                            await Promise.all(
                                actualBlocksOfTemplates.map(async (child) => {
                                    console.log(child, "child");
                                    let newChild;

                                    if (child.block_type == "normal") {
                                        const [temp] = await db
                                            .insert(blocks)
                                            .values([
                                                {
                                                    name: child.name,
                                                    block_type:
                                                        child.block_type,
                                                    description:
                                                        child.description,
                                                },
                                            ])
                                            .returning();
                                        newChild = temp;

                                        await db.insert(block_items).values([
                                            {
                                                parent_block_id:
                                                    newParent.block_id,
                                                reference_id: newChild.block_id,
                                                item_type: newChild.block_type,
                                            },
                                        ]);
                                    } else if (child.block_type == "array") {
                                        const [temp] = await db
                                            .insert(arrayBlocks)
                                            .values([
                                                {
                                                    name: child.name,
                                                    block_type:
                                                        child.block_type,
                                                    description:
                                                        child.description,
                                                },
                                            ])
                                            .returning();
                                        newChild = temp;

                                        const [arrayBlockItem] = await db
                                            .insert(arrayBlockItems)
                                            .values([
                                                {
                                                    parent_block_id:
                                                        newTemplate.array_block_id,
                                                    reference_id:
                                                        newChild.block_id,
                                                    item_type:
                                                        newChild.block_type,
                                                    parent_template_id:
                                                        newTemplateRef.template_id,
                                                },
                                            ])
                                            .returning();
                                    }
                                }),
                            );
                        }),
                    );
                }
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
