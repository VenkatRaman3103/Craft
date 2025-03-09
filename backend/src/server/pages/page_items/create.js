import { page_items } from "../../../db/schema/pages.js";
import { db } from "../../server.js";

export async function createPageItem(req, res) {
    const { page_id } = req.params;
    const { reference_id, type } = req.body;
    try {
        // Insert new page_item
        await db.insert(page_items).values({
            page_ref_id: page_id,
            reference_id: reference_id,
            item_type: type,
        });

        // Fetch updated page data
        const page = await db.query.pages.findFirst({
            where: (page, { eq }) => eq(page.page_id, page_id),
            with: {
                page_items: {
                    with: {
                        text_field: true,
                        block: true,
                        multi_select_field: {
                            with: {
                                options: true,
                            },
                        },
                        single_select_field: {
                            with: {
                                options: true,
                            },
                        },
                        number_field: true,
                        email_field: true,
                        date_field: true,
                        color_picker_field: true,
                        textarea_field: true,
                        json_field: true,
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
