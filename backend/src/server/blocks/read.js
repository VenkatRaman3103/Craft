import { eq } from "drizzle-orm";
import { blocks } from "../../db/schema/blocks.js";
import { db } from "../server.js";
import { getArrayBlockWithNestedContent } from "./arrayBlocks/read.js";

// get all blocks
export async function getAllBlocks(req, res) {
    try {
        const allBlocks = await db.select().from(blocks);
        res.status(200).json(allBlocks);
    } catch (error) {
        const errorMessage = {
            error,
            message: `Error in fetching the blocks`,
            origin: "backend/blocksRouter/GET",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
}

// get block by id
export async function getBlockById(req, res) {
    const { block_id } = req.params;

    try {
        const block = await db
            .select()
            .from(blocks)
            .where(eq(blocks.block_id, block_id));
        res.status(200).json(block);
    } catch (error) {
        const errorMessage = {
            error,
            message: `Error in fetching the block: ${block_id}`,
            origin: "backend/blocksRouter/GET",
        };

        res.status(500).json(errorMessage);
    }
}

// TODO: instead of formatting the data from response use drizzle-orm ( with functinality )
export async function getBlockWithNestedContent(block_id) {
    if (!block_id) return null;

    const block = await db.query.blocks.findFirst({
        where: (blocks, { eq }) => eq(blocks.block_id, block_id),
    });

    if (!block) return null;

    const items = await db.query.block_items.findMany({
        where: (blockItems, { eq }) => eq(blockItems.parent_block_id, block_id),
        // orderBy: (blockItems, { asc }) => asc(blockItems.order),
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
            } else if (item.item_type === "json_field") {
                const field = await db.query.jsonFields.findFirst({
                    where: (jsonFields, { eq }) =>
                        eq(jsonFields.field_id, item.reference_id),
                });
                return { item_type: "json_field", json_field: field };
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
            } else if (item.item_type === "number_field") {
                const field = await db.query.numberFields.findFirst({
                    where: (numberFields, { eq }) =>
                        eq(numberFields.field_id, item.reference_id),
                });
                return { item_type: "number_field", number_field: field };
            } else if (item.item_type === "email_field") {
                const field = await db.query.emailFields.findFirst({
                    where: (emailFields, { eq }) =>
                        eq(emailFields.field_id, item.reference_id),
                });
                return { item_type: "textarea_field", textarea_field: field };
            } else if (item.item_type === "multi_select_field") {
                const field = await db.query.multiSelectFields.findFirst({
                    where: (multiSelectFields, { eq }) =>
                        eq(multiSelectFields.field_id, item.reference_id),
                });
                return {
                    item_type: "multi_select",
                    multi_select: field,
                };
            } else if (item.item_type === "date_field") {
                const field = await db.query.dateFields.findFirst({
                    where: (dateFields, { eq }) =>
                        eq(dateFields.field_id, item.reference_id),
                });
                return {
                    item_type: "date_field",
                    date_field: field,
                };
            } else if (item.item_type === "color_picker_field") {
                const field = await db.query.dateFields.findFirst({
                    where: (dateFields, { eq }) =>
                        eq(dateFields.field_id, item.reference_id),
                });
                return {
                    item_type: "color_picker_field",
                    color_picker_field: field,
                };
            } else if (item.item_type === "url_field") {
                const field = await db.query.urlFields.findFirst({
                    where: (urlFields, { eq }) =>
                        eq(urlFields.field_id, item.reference_id),
                });
                return {
                    item_type: "url_field",
                    url_field: field,
                };
            } else if (item.item_type === "single_select_field") {
                const field = await db.query.singleSelectFields.findFirst({
                    where: (singleSelectFields, { eq }) =>
                        eq(singleSelectFields.field_id, item.reference_id),
                });
                return {
                    item_type: "single_select_field",
                    single_select_field: field,
                };
            }

            return null;
        }),
    );

    return { ...block, block_items: processedItems.filter(Boolean) };
}
// Express route handler

export async function getBlockByReference(req, res) {
    const { reference_id } = req.params;
    try {
        const block = await db
            .select()
            .from(blocks)
            .where(eq(blocks.reference_id, reference_id));
        res.status(200).json(block);
    } catch (error) {
        const errorMessage = {
            error,
            message: `Error in fetching the block: ${reference_id}`,
            origin: "backend/blocksRouter/GET",
        };
        res.status(500).json(errorMessage);
    }
}
