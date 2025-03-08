import { pages } from "../../db/schema/pages.js";
import { db } from "../server.js";

// READ: all page with blocks
export async function getAllPages(req, res) {
    try {
        const allPages = await db.select().from(pages);

        res.status(200).json(allPages);
    } catch (error) {
        const errorMessage = {
            error,
            message: `Error in fetching the pages`,
            origin: "backend/pagesRouter/GET",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
}

// READ: page by id
export async function getPageById(req, res) {
    const { page_id } = req.params;
    try {
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
                    },
                },
            },
        });
        res.status(200).json(page);
    } catch (error) {
        const errorMessage = {
            error,
            message: `Error in fetching the page: ${page_id}`,
            origin: "backend/pagesRouter/GET",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
}
