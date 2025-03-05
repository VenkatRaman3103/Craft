import { page_items } from "../../../db/schema/pages.js";
import { db } from "../../server.js";

export async function createPageItem(req, res) {
    const { page_id } = req.params;
    const { block_id } = req.body;
    try {
        // Insert new page_item
        await db.insert(page_items).values({
            page_ref_id: page_id,
            // TODO: add field_id
            reference_id: block_id,
            item_type: "block",
        });

        // Fetch updated page data
        const page = await db.query.pages.findFirst({
            where: (page, { eq }) => eq(page.page_id, page_id),
            with: {
                page_items: {
                    with: {
                        field: true,
                        block: true,
                    },
                },
            },
        });

        res.status(201).json(page);
    } catch (error) {
        const errorMessage = {
            error,
            message: `Error in creating the page_item: ${page_id}`,
            origin: "backend/pagesRouter/CREATE",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
}
