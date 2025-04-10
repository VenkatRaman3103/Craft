import { eq } from "drizzle-orm";
import { db } from "../../server.js";
import { getBlockWithNestedContent } from "../read.js";
import { arrayBlockItems } from "../../../db/schema/blocks/arrayBlocks/arrayBlockItems/schema.js";
import { arrayBlocks } from "../../../db/schema/blocks/arrayBlocks/schema.js";
import { arrayBlockTemplates } from "../../../db/schema/index.js";

export async function getArrayBlocks(req, res) {
    try {
        const arrayBlocksResponse = await db.select().from(arrayBlocks);
        res.json(arrayBlocksResponse);
    } catch (error) {
        const errorMessage = {
            error: error.message,
            origin: "backend/arrayBlocks/read/GET",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
}

export async function getArrayBlocksById(req, res) {
    try {
        const { block_id } = req.params;
        const arrayBlockResponse = await db
            .select()
            .from(arrayBlocks)
            .where(eq(arrayBlocks.block_id, block_id));
        res.json(arrayBlockResponse);
    } catch (error) {
        const errorMessage = {
            error: error.message,
            origin: "backend/arrayBlocks/read/GET",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
}

export async function nestedArrayBlocks(req, res) {
    const { block_id } = req.params;

    try {
        const arrayBlock = await getArrayBlockWithNestedContent(block_id);

        if (!arrayBlock) {
            return res.status(404).json({ error: "Array block not found" });
        }

        res.json(arrayBlock);
    } catch (error) {
        const errorMessage = {
            error: error.message,
            origin: "backend/arrayBlocks/read/GET",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
}

export async function getArrayBlockWithNestedContent(block_id) {
    if (!block_id) return null;

    const block = await db.query.arrayBlocks.findFirst({
        where: (blocks, { eq }) => eq(blocks.block_id, block_id),
    });

    if (!block) return null;

    const items = await db.query.arrayBlockItems.findMany({
        where: (arrayBlockItems, { eq }) =>
            eq(arrayBlockItems.parent_block_id, block_id),
    });

    const processedItems = await Promise.all(
        items.map(async (item) => {
            if (item.item_type === "text_field") {
                const field = await db.query.textFields.findFirst({
                    where: (textFields, { eq }) =>
                        eq(textFields.field_id, item.reference_id),
                });
                return { item_type: "text_field", text_field: field };
            } else if (item.item_type === "textarea_field") {
                const field = await db.query.textAreaFields.findFirst({
                    where: (textAreaFields, { eq }) =>
                        eq(textAreaFields.field_id, item.reference_id),
                });
                return { item_type: "textarea_field", textarea_field: field };
            } else if (item.item_type === "normal") {
                const nestedContent = await getBlockWithNestedContent(
                    item.reference_id,
                );
                return { item_type: item.item_type, normal: nestedContent };
            } else if (item.item_type === "array") {
                const nestedContent = await getArrayBlockWithNestedContent(
                    item.reference_id,
                );
                return { item_type: item.item_type, array: nestedContent };
            }

            return null;
        }),
    );

    return { ...block, block_items: processedItems.filter(Boolean) };
}

export async function getArrayBlocksWithTemplates(req, res) {
    const { block_id } = req.params;

    try {
        const response = await db.query.arrayBlockTemplates.findMany({
            where: (arrayBlockTemplates, { eq }) =>
                eq(arrayBlockTemplates.array_block_id, block_id),
        });

        const templates = await Promise.all(
            response.map((item) =>
                getArrayBlocksWithTemplatesNested(
                    item.array_block_id,
                    item.template_id,
                ),
            ),
        );

        // const data = await getArrayBlocksWithTemplatesNested(
        //     response[0].array_block_id,
        //     response[0].template_id,
        // );
        // console.log(data, "data");

        res.json(templates);
    } catch (error) {
        const errorMessage = {
            error: error.message,
            origin: "backend/arrayBlocks/getArrayBlocksWithTemplates/GET",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
}

export async function getArrayBlocksWithTemplatesNested(block_id, template_id) {
    if (!block_id) return null;

    const block = await db.query.arrayBlocks.findFirst({
        where: (blocks, { eq }) => eq(blocks.block_id, block_id),
    });

    if (!block) return null;

    const items = await db.query.arrayBlockItems.findMany({
        where: (arrayBlockItems, { eq }) =>
            eq(arrayBlockItems.parent_block_id, block_id),
    });
    console.log(block, "item");

    const processedItems = await Promise.all(
        items.map(async (item) => {
            if (item.item_type === "text_field") {
                const field = await db.query.textFields.findFirst({
                    where: (textFields, { eq }) =>
                        eq(textFields.field_id, item.reference_id),
                });
                return { item_type: "text_field", text_field: field };
            } else if (item.item_type === "textarea_field") {
                const field = await db.query.textAreaFields.findFirst({
                    where: (textAreaFields, { eq }) =>
                        eq(textAreaFields.field_id, item.reference_id),
                });
                return { item_type: "textarea_field", textarea_field: field };
            } else if (item.item_type === "normal") {
                const nestedContent = await getBlockWithNestedContent(
                    item.reference_id,
                    // template.template_id,
                );
                return { item_type: item.item_type, normal: nestedContent };
            } else if (item.item_type === "array") {
                const nestedContent = await getArrayBlocksWithTemplatesNested(
                    item.reference_id,
                    template_id,
                );
                // console.log(nestedContent, "nestedContent");
                return { item_type: item.item_type, array: nestedContent };
            }

            return null;
        }),
    );

    return { ...block, block_items: processedItems.filter(Boolean) };
}
