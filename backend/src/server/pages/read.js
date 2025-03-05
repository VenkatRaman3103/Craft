import { eq } from "drizzle-orm";
import { blocks } from "../../db/schema/blocks.js";
import { pages } from "../../db/schema/pages.js";
import { db } from "../server.js";

// READ: all page with blocks
export async function getAllPages(req, res) {
    try {
        const allPages = await db.select().from(pages);

        // const result = [];

        // const allBlocks = await db.select().from(blocks);

        // TODO: get blocks for every page
        // for (let page of allPages) {
        //     const page_id = page.page_id;
        //
        //     const pageBlocks = allBlocks.filter(
        //         (block) => block.reference_id === page_id,
        //     );
        //
        //     page.blocks = pageBlocks;
        //
        //     result.push(page);
        // }

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
                        field: true,
                        block: true,
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
