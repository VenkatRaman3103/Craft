import express from "express";
import { db } from "../server.js";
import { v4 as uuidv4 } from "uuid";
import { block_items, blocks } from "../../db/schema/blocks.js";
import { textFields } from "../../db/schema/fields.js";

export const testRoute = express.Router();

async function createDummyData() {
    try {
        console.log("Creating dummy data...");

        // Create a top-level block
        const mainBlockId = uuidv4();
        await db.insert(blocks).values({
            block_id: mainBlockId,
            name: "Main Content Block",
            description:
                "A top-level block containing nested blocks and fields",
            block_type: "content",
        });
        console.log(`Created main block with ID: ${mainBlockId}`);

        // Create a nested block
        const nestedBlockId = uuidv4();
        await db.insert(blocks).values({
            block_id: nestedBlockId,
            name: "Nested Hero Block",
            description: "A hero block nested inside the main content block",
            block_type: "hero",
        });
        console.log(`Created nested block with ID: ${nestedBlockId}`);

        // Create another nested block (deeper nesting)
        const deepNestedBlockId = uuidv4();
        await db.insert(blocks).values({
            block_id: deepNestedBlockId,
            name: "Deep Nested Gallery Block",
            description: "A gallery block nested inside the hero block",
            block_type: "gallery",
        });
        console.log(`Created deep nested block with ID: ${deepNestedBlockId}`);

        // Create text fields
        const titleFieldId = uuidv4();
        await db.insert(textFields).values({
            field_id: titleFieldId,
            name: "title",
            label: "Title",
            value: "Welcome to our site",
            type: "text",
            required: true,
            description: "The main heading for the page",
        });
        console.log(`Created title field with ID: ${titleFieldId}`);

        const subtitleFieldId = uuidv4();
        await db.insert(textFields).values({
            field_id: subtitleFieldId,
            name: "subtitle",
            label: "Subtitle",
            value: "Learn more about our services",
            type: "text",
            required: false,
            description: "A subtitle displayed below the main heading",
        });
        console.log(`Created subtitle field with ID: ${subtitleFieldId}`);

        const descriptionFieldId = uuidv4();
        await db.insert(textFields).values({
            field_id: descriptionFieldId,
            name: "description",
            label: "Description",
            value: "This is a detailed description of our services and offerings.",
            type: "textarea",
            required: false,
            description: "A longer text describing the content",
        });
        console.log(`Created description field with ID: ${descriptionFieldId}`);

        const galleryTitleFieldId = uuidv4();
        await db.insert(textFields).values({
            field_id: galleryTitleFieldId,
            name: "gallery_title",
            label: "Gallery Title",
            value: "Our Project Gallery",
            type: "text",
            required: true,
            description: "Title for the gallery section",
        });
        console.log(
            `Created gallery title field with ID: ${galleryTitleFieldId}`,
        );

        // Create block items for main block
        await db.insert(block_items).values({
            item_id: uuidv4(),
            parent_block_id: mainBlockId,
            item_type: "text_field",
            reference_id: titleFieldId,
            order: "1",
        });

        await db.insert(block_items).values({
            item_id: uuidv4(),
            parent_block_id: mainBlockId,
            item_type: "text_field",
            reference_id: subtitleFieldId,
            order: "2",
        });

        await db.insert(block_items).values({
            item_id: uuidv4(),
            parent_block_id: mainBlockId,
            item_type: "block",
            reference_id: nestedBlockId,
            order: "3",
        });

        // Create block items for nested hero block
        await db.insert(block_items).values({
            item_id: uuidv4(),
            parent_block_id: nestedBlockId,
            item_type: "text_field",
            reference_id: descriptionFieldId,
            order: "1",
        });

        await db.insert(block_items).values({
            item_id: uuidv4(),
            parent_block_id: nestedBlockId,
            item_type: "block",
            reference_id: deepNestedBlockId,
            order: "2",
        });

        // Create block items for deep nested gallery block
        await db.insert(block_items).values({
            item_id: uuidv4(),
            parent_block_id: deepNestedBlockId,
            item_type: "text_field",
            reference_id: galleryTitleFieldId,
            order: "1",
        });

        console.log("Dummy data creation complete!");
        return mainBlockId;
    } catch (error) {
        console.error("Error creating dummy data:", error);
        throw error;
    }
}

async function getBlockWithNestedContent(blockId) {
    const block = await db.query.blocks.findFirst({
        where: (blocks, { eq }) => eq(blocks.block_id, blockId),
    });

    if (!block) return null;

    const items = await db.query.block_items.findMany({
        where: (blockItems, { eq }) => eq(blockItems.parent_block_id, blockId),
        orderBy: (blockItems, { asc }) => asc(blockItems.order),
    });

    const processedItems = await Promise.all(
        items.map(async (item) => {
            // Check the item type and fetch from the appropriate table
            if (item.item_type === "text_field") {
                const field = await db.query.textFields.findFirst({
                    where: (textFields, { eq }) =>
                        eq(textFields.field_id, item.reference_id),
                });
                return {
                    type: "text_field",
                    data: field,
                };
            }
            // Add other field types as needed

            // Check if it's a block (for nested blocks)
            else if (item.item_type === "block") {
                const nestedContent = await getBlockWithNestedContent(
                    item.reference_id,
                );
                return {
                    type: "block",
                    data: nestedContent,
                };
            }
            return null;
        }),
    );

    return {
        ...block,
        items: processedItems.filter(Boolean),
    };
}

testRoute.get("/test/:block_id", async (req, res) => {
    const { block_id } = req.params;
    try {
        const result = await getBlockWithNestedContent(block_id);
        res.json(result);
    } catch (error) {
        console.error("Query error:", error);
        res.status(500).json({
            error: `Internal server error: ${error.message}`,
        });
    }
});

testRoute.get("/setup-test-data", async (req, res) => {
    try {
        const mainBlockId = await createDummyData();
        res.json({
            success: true,
            message: "Test data created successfully",
            mainBlockId,
        });
    } catch (error) {
        console.error("Error setting up test data:", error);
        res.status(500).json({
            error: `Failed to create test data: ${error.message}`,
        });
    }
});
