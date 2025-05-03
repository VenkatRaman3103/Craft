import { eq } from "drizzle-orm";
import { db } from "../../server.js";
import { getBlockWithNestedContent } from "../read.js";
import { arrayBlockItems } from "../../../db/schema/blocks/arrayBlocks/arrayBlockItems/schema.js";
import { arrayBlocks } from "../../../db/schema/blocks/arrayBlocks/schema.js";
import { arrayBlockTemplates, textFields } from "../../../db/schema/index.js";

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
            } else if (item.item_type === "api") {
                const block = await db.query.apiBlocks.findFirst({
                    where: (apiBlocks, { eq }) =>
                        eq(apiBlocks.block_id, item.reference_id),
                });
                return { item_type: "api", api: block };
            } else if (item.item_type === "reference") {
                const block = await db.query.referenceBlock.findFirst({
                    where: (referenceBlock, { eq }) =>
                        eq(referenceBlock.block_id, item.reference_id),
                });
                return { item_type: "reference", reference: block };
            } else if (item.item_type === "table") {
                const block = await db.query.tableBlocks.findFirst({
                    where: (tableBlocks, { eq }) =>
                        eq(tableBlocks.block_id, item.reference_id),
                });
                return { item_type: "table", table: block };
            } else if (item.item_type === "email_field") {
                const field = await db.query.emailFields.findFirst({
                    where: (emailFields, { eq }) =>
                        eq(emailFields.field_id, item.reference_id),
                });
                return { item_type: "email_field", email_field: field };
            } else if (item.item_type === "multi_select_field") {
                const field = await db.query.multiSelectFields.findFirst({
                    where: (multiSelectFields, { eq }) =>
                        eq(multiSelectFields.field_id, item.reference_id),
                });
                const fieldOptions = await db.query.multiSelectOptions.findMany(
                    {
                        where: (multiSelectOptions, { eq }) =>
                            eq(multiSelectOptions.field_id, field.field_id),
                    },
                );
                console.log(fieldOptions, "fieldOptions");

                const result = {
                    ...field,
                    options: fieldOptions,
                };

                return {
                    item_type: "multi_select_field",
                    multi_select_field: result,
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
                const field = await db.query.colorPickerFields.findFirst({
                    where: (colorPickerFields, { eq }) =>
                        eq(colorPickerFields.field_id, item.reference_id),
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

                const fieldOptions =
                    await db.query.singleSelectOptions.findMany({
                        where: (singleSelectOptions, { eq }) =>
                            eq(singleSelectOptions.field_id, field.field_id),
                    });

                const result = {
                    ...field,
                    options: fieldOptions,
                };

                return {
                    item_type: "single_select_field",
                    single_select_field: result,
                };
            }

            return null;
        }),
    );

    return { ...block, block_items: processedItems.filter(Boolean) };
}

export async function getArrayTemplates(block_id) {
    const templates = await db.query.arrayBlockTemplates.findMany({
        where: (arrayBlockTemplates, { eq }) =>
            eq(arrayBlockTemplates.array_block_id, block_id),
    });

    const templatesItems = await Promise.all(
        templates.map(async (item) => {
            const template_id = item.template_id;

            const blockItems = await db.query.arrayBlockItems.findMany({
                where: (arrayBlockItems, { eq }) =>
                    eq(arrayBlockItems.parent_template_id, template_id),
            });

            const nestedBlockItems = await Promise.all(
                blockItems.map(async (item) => {
                    let some;

                    if (item.item_type === "array") {
                        const result = await getArrayBlockWithNestedContent(
                            item.reference_id,
                        );
                        some = {
                            item_type: "array",
                            item_id: result?.block_id,
                            array: result,
                        };
                    } else if (item.item_type === "normal") {
                        const result = await getBlockWithNestedContent(
                            item.reference_id,
                        );
                        some = {
                            item_type: "normal",
                            item_id: result?.block_id,
                            normal: result,
                        };
                    } else if (item.item_type === "text_field") {
                        const result = await db.query.textFields.findFirst({
                            where: (textFields, { eq }) =>
                                eq(textFields.field_id, item.reference_id),
                        });

                        some = {
                            item_type: "text_field",
                            item_id: result.field_id,
                            text_field: result,
                        };
                    } else if (item.item_type === "textarea_field") {
                        const result = await db.query.textAreaFields.findFirst({
                            where: (textAreaFields, { eq }) =>
                                eq(textAreaFields.field_id, item.reference_id),
                        });

                        some = {
                            item_type: "textarea_field",
                            item_id: result.field_id,
                            textarea_field: result,
                        };
                    } else if (item.item_type === "number_field") {
                        const result = await db.query.numberFields.findFirst({
                            where: (field, { eq }) =>
                                eq(field.field_id, item.reference_id),
                        });

                        some = {
                            item_type: "number_field",
                            item_id: result.field_id,
                            number_field: result,
                        };
                    } else if (item.item_type === "json_field") {
                        const result = await db.query.jsonFields.findFirst({
                            where: (jsonFields, { eq }) =>
                                eq(jsonFields.field_id, item.reference_id),
                        });

                        some = {
                            item_type: "json_field",
                            item_id: result.field_id,
                            json_field: result,
                        };
                    } else if (item.item_type === "email_field") {
                        const result = await db.query.emailFields.findFirst({
                            where: (emailFields, { eq }) =>
                                eq(emailFields.field_id, item.reference_id),
                        });

                        some = {
                            item_type: "email_field",
                            item_id: result.field_id,
                            email_field: result,
                        };
                    } else if (item.item_type === "api") {
                        const result = await db.query.apiBlocks.findFirst({
                            where: (apiBlocks, { eq }) =>
                                eq(apiBlocks.block_id, item.reference_id),
                        });

                        some = {
                            item_type: "api",
                            item_id: result.block_id,
                            api: result,
                        };
                    } else if (item.item_type === "reference") {
                        const result = await db.query.referenceBlock.findFirst({
                            where: (referenceBlock, { eq }) =>
                                eq(referenceBlock.block_id, item.reference_id),
                        });

                        some = {
                            item_type: "reference",
                            item_id: result.block_id,
                            reference: result,
                        };
                    } else if (item.item_type === "table") {
                        const result = await db.query.tableBlocks.findFirst({
                            where: (tableBlocks, { eq }) =>
                                eq(tableBlocks.block_id, item.reference_id),
                        });

                        console.log(result, item, item.reference_id);

                        some = {
                            item_type: "table",
                            item_id: result.block_id,
                            table: result,
                        };
                    } else if (item.item_type === "multi_select_field") {
                        const result =
                            await db.query.multiSelectFields.findFirst({
                                where: (multiSelectFields, { eq }) =>
                                    eq(
                                        multiSelectFields.field_id,
                                        item.reference_id,
                                    ),
                            });

                        const fieldOptions =
                            await db.query.multiSelectOptions.findMany({
                                where: (multiSelectOptions, { eq }) =>
                                    eq(
                                        multiSelectOptions.field_id,
                                        result.field_id,
                                    ),
                            });

                        const fieldWithOptions = {
                            ...result,
                            options: fieldOptions,
                        };

                        some = {
                            item_type: "multi_select_field",
                            item_id: result.field_id,
                            multi_select_field: fieldWithOptions,
                        };
                    } else if (item.item_type === "date_field") {
                        const result = await db.query.dateFields.findFirst({
                            where: (field, { eq }) =>
                                eq(field.field_id, item.reference_id),
                        });

                        some = {
                            item_type: "date_field",
                            item_id: result.field_id,
                            date_field: result,
                        };
                    } else if (item.item_type === "color_picker_field") {
                        const result =
                            await db.query.colorPickerFields.findFirst({
                                where: (field, { eq }) =>
                                    eq(field.field_id, item.reference_id),
                            });

                        some = {
                            item_type: "color_picker_field",
                            item_id: result.field_id,
                            color_picker_field: result,
                        };
                    } else if (item.item_type === "url_field") {
                        const result = await db.query.urlFields.findFirst({
                            where: (field, { eq }) =>
                                eq(field.field_id, item.reference_id),
                        });

                        some = {
                            item_type: "url_field",
                            item_id: result.field_id,
                            url_field: result,
                        };
                    } else if (item.item_type === "single_select_field") {
                        const result =
                            await db.query.singleSelectFields.findFirst({
                                where: (field, { eq }) =>
                                    eq(field.field_id, item.reference_id),
                            });

                        const fieldOptions =
                            await db.query.singleSelectOptions.findMany({
                                where: (singleSelectOptions, { eq }) =>
                                    eq(
                                        singleSelectOptions.field_id,
                                        result.field_id,
                                    ),
                            });

                        const fieldWithOptions = {
                            ...result,
                            options: fieldOptions,
                        };

                        some = {
                            item_type: "single_select_field",
                            item_id: result.field_id,
                            single_select_field: fieldWithOptions,
                        };
                    }

                    return some;
                }),
            );

            return {
                templateId: template_id,
                templateItems: nestedBlockItems.filter(Boolean),
                item_type: "array",
            };
        }),
    );
    return templatesItems;
}

export async function getArrayBlocksWithTemplates(req, res) {
    const { block_id } = req.params;

    try {
        const data = await getArrayTemplates(block_id);
        res.json(data);
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
            } else if (item.item_type === "api") {
                const block = await db.query.apiBlocks.findFirst({
                    where: (apiBlocks, { eq }) =>
                        eq(apiBlocks.block_id, item.reference_id),
                });
                return { item_type: "api", api: block };
            } else if (item.item_type === "reference") {
                const block = await db.query.referenceBlock.findFirst({
                    where: (referenceBlock, { eq }) =>
                        eq(referenceBlock.block_id, item.reference_id),
                });
                return { item_type: "reference", reference: block };
            } else if (item.item_type === "table") {
                const block = await db.query.tableBlocks.findFirst({
                    where: (tableBlocks, { eq }) =>
                        eq(tableBlocks.block_id, item.reference_id),
                });
                return { item_type: "table", table: block };
            } else if (item.item_type === "email_field") {
                const field = await db.query.emailFields.findFirst({
                    where: (emailFields, { eq }) =>
                        eq(emailFields.field_id, item.reference_id),
                });
                return { item_type: "email_field", email_field: field };
            } else if (item.item_type === "json_field") {
                const field = await db.query.jsonFields.findFirst({
                    where: (jsonFields, { eq }) =>
                        eq(jsonFields.field_id, item.reference_id),
                });
                return { item_type: "json_field", json_field: field };
            } else if (item.item_type === "number_field") {
                const field = await db.query.numberFields.findFirst({
                    where: (numberFields, { eq }) =>
                        eq(numberFields.field_id, item.reference_id),
                });
                return { item_type: "number_field", number_field: field };
            } else if (item.item_type === "multi_select") {
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
                return { item_type: "date_field", date_field: field };
            } else if (item.item_type === "color_picker_field") {
                const field = await db.query.colorPickerFields.findFirst({
                    where: (colorPickerFields, { eq }) =>
                        eq(colorPickerFields.field_id, item.reference_id),
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
                return { item_type: "url_field", url_field: field };
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
