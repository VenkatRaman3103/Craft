import { db } from "../server/server.js";
import { sampleBlocks } from "./queries/blocks.js";
import { samplePages } from "./queries/pages.js";
import { sampleChild } from "./queries/test/child.js";
import { sampleParent } from "./queries/test/parent.js";
import { blocks } from "./schema/blocks.js";
import { textFields } from "./schema/fields.js";
import { page_items, pages } from "./schema/pages.js";
import { v4 as uuidv4 } from "uuid";

async function seed() {
    async function insertDummyData() {
        // Create page IDs
        const homePageId = "c2937bda-026d-46e3-b9ca-c2cbe43fc67d";
        // const aboutPageId = uuidv4();

        // Insert pages
        // await db.insert(pages).values([
        // {
        //     page_id: homePageId,
        //     title: "Page Title",
        //     slug: "home",
        //     created_at: new Date(),
        //     edited_at: new Date(),
        // },
        // {
        //     page_id: aboutPageId,
        //     title: "About Us",
        //     slug: "about",
        //     created_at: new Date(),
        //     edited_at: new Date(),
        // },
        // ]);

        // Insert text fields
        // const fieldIds = [uuidv4(), uuidv4(), uuidv4()];
        // await db.insert(textFields).values([
        //     {
        //         field_id: fieldIds[0],
        //         name: "headline",
        //         label: "Headline",
        //         value: "Welcome to Our Website!",
        //         created_at: new Date(),
        //         edited_at: new Date(),
        //     },
        //     {
        //         field_id: fieldIds[1],
        //         name: "subheadline",
        //         label: "Subheadline",
        //         value: "Discover amazing things with us",
        //         created_at: new Date(),
        //         edited_at: new Date(),
        //     },
        //     {
        //         field_id: fieldIds[2],
        //         name: "contact_email",
        //         label: "Contact Email",
        //         value: "info@example.com",
        //         created_at: new Date(),
        //         edited_at: new Date(),
        //     },
        // ]);

        // Insert blocks
        const blockIds = [uuidv4(), uuidv4(), uuidv4()];
        await db.insert(blocks).values([
            {
                block_id: blockIds[0],
                name: "Hero Section",
                description: "Main banner with a call-to-action button",
                scope: "page",
                reference_id: homePageId,
                createdAt: new Date(),
                editedAt: new Date(),
            },
            {
                block_id: blockIds[1],
                name: "Features Block",
                description: "Highlight key features",
                scope: "global",
                reference_id: null,
                createdAt: new Date(),
                editedAt: new Date(),
            },
            // {
            //     block_id: blockIds[2],
            //     name: "Team Section",
            //     description: "Our awesome team members",
            //     scope: "page",
            //     reference_id: aboutPageId,
            //     createdAt: new Date(),
            //     editedAt: new Date(),
            // },
        ]);

        // Insert page items (mixing fields and blocks)
        await db.insert(page_items).values([
            // Home Page items
            // {
            //     item_id: uuidv4(),
            //     page_ref_id: homePageId,
            //     item_type: "field",
            //     reference_id: fieldIds[0],
            // },
            // {
            //     item_id: uuidv4(),
            //     page_ref_id: homePageId,
            //     item_type: "field",
            //     reference_id: fieldIds[1],
            // },
            {
                item_id: uuidv4(),
                page_ref_id: homePageId,
                item_type: "block",
                reference_id: blockIds[0],
            },
            {
                item_id: uuidv4(),
                page_ref_id: homePageId,
                item_type: "block",
                reference_id: blockIds[1],
            },

            // About Us page items
            // {
            //     item_id: uuidv4(),
            //     page_ref_id: aboutPageId,
            //     item_type: "field",
            //     reference_id: fieldIds[2],
            // },
            // {
            //     item_id: uuidv4(),
            //     page_ref_id: aboutPageId,
            //     item_type: "block",
            //     reference_id: blockIds[2],
            // },
        ]);
    }

    await insertDummyData();

    // await samplePages();
    // await db.delete(pages);
    // await db.delete(page_items);
    // await db.delete(textFields);
    // await db.delete(blocks);
    //
    // await getPages();
    // await sampleParent();
    // await sampleChild();
    // await sampleBlocks();
    // await sampleCollectionJoinPages();
    // await sampleCollections();
    // await deleteCollections();
    // await insertDummyData();
}

seed().catch((error) => {
    console.log(error);
    process.exit(1);
});
