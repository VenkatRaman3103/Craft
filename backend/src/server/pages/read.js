import { eq } from "drizzle-orm";
import { blocks } from "../../db/schema/blocks.js";
import { pages } from "../../db/schema/pages.js";
import { db } from "../server.js";

export async function getAllPages(req, res) {
    try {
        const allPages = await db.select().from(pages);

        const result = [];

        // TODO: get blocks for every page
        for (let page of allPages) {
            const page_id = page.page_id;

            const blocksList = await db
                .select()
                .from(blocks)
                .where(eq(blocks.reference_id, page_id));

            page.blocks = blocksList;

            result.push(page);
        }

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
