import { db } from "../../server/server.js";
import { blocks } from "../schema/blocks.js";
import { textFields } from "../schema/fields.js";
import { page_items, pages } from "../schema/pages.js";
import { v4 as uuidv4 } from "uuid";

export async function samplePages() {
    try {
        const existingPages = await db.select().from(pages);

        if (existingPages.length === 0) {
            await db.insert(pages).values([
                {
                    page_id: "5112c791-4778-49c3-bffe-9d35f0904784",
                    title: "Home Page",
                    slug: "home",
                },
                {
                    page_id: "6b6d56b2-5b1e-42d3-9235-40a7f3d18c47",
                    title: "About Us",
                    slug: "about",
                },
            ]);

            await db.insert(page_items).values([
                {
                    item_id: "8872f726-85be-4182-978c-f36ef6510a39",
                    page_ref_id: "5112c791-4778-49c3-bffe-9d35f0904784",
                    item_type: "field",
                    reference_id: "f1234567-89ab-cdef-0123-456789abcdef",
                },
                {
                    item_id: "4f27ad8e-1abd-419e-8a6e-16771e1a601c",
                    page_ref_id: "6b6d56b2-5b1e-42d3-9235-40a7f3d18c47",
                    item_type: "block",
                    reference_id: "b9876543-21fe-dcba-9876-543210fedcba",
                },
            ]);

            await db.insert(textFields).values([
                {
                    field_id: "f1234567-89ab-cdef-0123-456789abcdef",
                    name: "headline",
                    label: "Headline",
                    value: "Welcome to Our Website!",
                },
                {
                    field_id: "f2234567-89ab-cdef-0123-456789abcdef",
                    name: "subheadline",
                    label: "Subheadline",
                    value: "We provide the best services.",
                },
            ]);

            await db.insert(blocks).values([
                {
                    block_id: "b9876543-21fe-dcba-9876-543210fedcba",
                    name: "Hero Section",
                    description: "Main banner with a call-to-action button",
                    scope: "page",
                    reference_id: "5112c791-4778-49c3-bffe-9d35f0904784",
                },
                {
                    block_id: "b2226543-21fe-dcba-9876-543210fedcba",
                    name: "Footer",
                    description: "Footer section with links",
                    scope: "global",
                },
            ]);
            console.log("✅ Sample data inserted.");
        } else {
            console.log("⚠️ Data already exists. Skipping insert.");
        }
    } catch (error) {
        console.log("❌ Error inserting sample data:", error);
    }
}
