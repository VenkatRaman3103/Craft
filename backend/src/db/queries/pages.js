import { db } from "../../server/server.js";
import {
    blocks,
    blockTypes,
    fieldDefinitions,
    fieldValues,
    pages,
} from "../schema/pages.js";
import { v4 as uuidv4 } from "uuid";

export async function samplePages() {
    try {
        await db.insert(pages).values({
            page_id: "5112c791-4778-49c3-bffe-9d35f0904784",
            title: "page title 1",
        });
    } catch (error) {
        console.log(error);
    }
}

// Function to insert dummy data
export async function insertDummyData() {
    try {
        // Generate UUIDs for all our entities
        const pageId = uuidv4();

        const textBlockTypeId = uuidv4();
        const formBlockTypeId = uuidv4();
        const galleryBlockTypeId = uuidv4();

        const textBlockId = uuidv4();
        const formBlockId = uuidv4();
        const galleryBlockId = uuidv4();

        // Create pages
        await db.insert(pages).values([
            {
                page_id: pageId,
                title: "Home Page",
                slug: "home",
            },
            {
                page_id: uuidv4(),
                title: "About Us",
                slug: "about-us",
            },
            {
                page_id: uuidv4(),
                title: "Contact",
                slug: "contact",
            },
        ]);

        // Create block types
        await db.insert(blockTypes).values([
            {
                block_type_id: textBlockTypeId,
                name: "Text Block",
                description: "A simple text content block",
            },
            {
                block_type_id: formBlockTypeId,
                name: "Form Block",
                description: "A block for collecting user input",
            },
            {
                block_type_id: galleryBlockTypeId,
                name: "Gallery Block",
                description: "A block for displaying multiple images",
            },
        ]);

        // Create blocks on the home page
        await db.insert(blocks).values([
            {
                block_id: textBlockId,
                page_id: pageId,
                block_type_id: textBlockTypeId,
                order: 1,
            },
            {
                block_id: formBlockId,
                page_id: pageId,
                block_type_id: formBlockTypeId,
                order: 2,
            },
            {
                block_id: galleryBlockId,
                page_id: pageId,
                block_type_id: galleryBlockTypeId,
                order: 3,
            },
        ]);

        // Create field definitions for text block
        const titleFieldDefId = uuidv4();
        const contentFieldDefId = uuidv4();

        await db.insert(fieldDefinitions).values([
            {
                field_def_id: titleFieldDefId,
                block_type_id: textBlockTypeId,
                name: "title",
                label: "Title",
                type: "text",
                required: true,
                default_value: null,
                options: null,
                order: 1,
            },
            {
                field_def_id: contentFieldDefId,
                block_type_id: textBlockTypeId,
                name: "content",
                label: "Content",
                type: "text",
                required: true,
                default_value: null,
                options: null,
                order: 2,
            },
        ]);

        // Create field definitions for form block
        const formTitleFieldDefId = uuidv4();
        const formFieldsFieldDefId = uuidv4();
        const submitButtonTextFieldDefId = uuidv4();

        await db.insert(fieldDefinitions).values([
            {
                field_def_id: formTitleFieldDefId,
                block_type_id: formBlockTypeId,
                name: "formTitle",
                label: "Form Title",
                type: "text",
                required: true,
                default_value: "Contact Us",
                options: null,
                order: 1,
            },
            {
                field_def_id: formFieldsFieldDefId,
                block_type_id: formBlockTypeId,
                name: "fields",
                label: "Form Fields",
                type: "multi-select",
                required: true,
                default_value: ["name", "email"],
                options: [
                    "name",
                    "email",
                    "phone",
                    "company",
                    "message",
                    "subscribe",
                ],
                order: 2,
            },
            {
                field_def_id: submitButtonTextFieldDefId,
                block_type_id: formBlockTypeId,
                name: "submitButtonText",
                label: "Submit Button Text",
                type: "text",
                required: true,
                default_value: "Submit",
                options: null,
                order: 3,
            },
        ]);

        // Create field definitions for gallery block
        const galleryTitleFieldDefId = uuidv4();
        const imagesFieldDefId = uuidv4();
        const columnsFieldDefId = uuidv4();

        await db.insert(fieldDefinitions).values([
            {
                field_def_id: galleryTitleFieldDefId,
                block_type_id: galleryBlockTypeId,
                name: "galleryTitle",
                label: "Gallery Title",
                type: "text",
                required: false,
                default_value: null,
                options: null,
                order: 1,
            },
            {
                field_def_id: imagesFieldDefId,
                block_type_id: galleryBlockTypeId,
                name: "images",
                label: "Gallery Images",
                type: "multi-select",
                required: true,
                default_value: null,
                options: null, // In a real app, this might be populated dynamically
                order: 2,
            },
            {
                field_def_id: columnsFieldDefId,
                block_type_id: galleryBlockTypeId,
                name: "columns",
                label: "Number of Columns",
                type: "select",
                required: true,
                default_value: "3",
                options: ["1", "2", "3", "4"],
                order: 3,
            },
        ]);

        // Create field values for the text block on the home page
        await db.insert(fieldValues).values([
            {
                field_value_id: uuidv4(),
                block_id: textBlockId,
                field_def_id: titleFieldDefId,
                value: "Welcome to our Website",
            },
            {
                field_value_id: uuidv4(),
                block_id: textBlockId,
                field_def_id: contentFieldDefId,
                value: "This is the homepage of our amazing website. We offer great products and services that will meet all your needs.",
            },
        ]);

        // Create field values for the form block
        await db.insert(fieldValues).values([
            {
                field_value_id: uuidv4(),
                block_id: formBlockId,
                field_def_id: formTitleFieldDefId,
                value: "Get in Touch",
            },
            {
                field_value_id: uuidv4(),
                block_id: formBlockId,
                field_def_id: formFieldsFieldDefId,
                value: ["name", "email", "message", "subscribe"],
            },
            {
                field_value_id: uuidv4(),
                block_id: formBlockId,
                field_def_id: submitButtonTextFieldDefId,
                value: "Send Message",
            },
        ]);

        // Create field values for the gallery block
        await db.insert(fieldValues).values([
            {
                field_value_id: uuidv4(),
                block_id: galleryBlockId,
                field_def_id: galleryTitleFieldDefId,
                value: "Our Portfolio",
            },
            {
                field_value_id: uuidv4(),
                block_id: galleryBlockId,
                field_def_id: imagesFieldDefId,
                value: [
                    {
                        id: "img1",
                        src: "/images/portfolio1.jpg",
                        alt: "Project 1",
                    },
                    {
                        id: "img2",
                        src: "/images/portfolio2.jpg",
                        alt: "Project 2",
                    },
                    {
                        id: "img3",
                        src: "/images/portfolio3.jpg",
                        alt: "Project 3",
                    },
                    {
                        id: "img4",
                        src: "/images/portfolio4.jpg",
                        alt: "Project 4",
                    },
                    {
                        id: "img5",
                        src: "/images/portfolio5.jpg",
                        alt: "Project 5",
                    },
                    {
                        id: "img6",
                        src: "/images/portfolio6.jpg",
                        alt: "Project 6",
                    },
                ],
            },
            {
                field_value_id: uuidv4(),
                block_id: galleryBlockId,
                field_def_id: columnsFieldDefId,
                value: "3",
            },
        ]);

        console.log("Dummy data inserted successfully!");
    } catch (error) {
        console.error("Error inserting dummy data:", error);
    }
}
