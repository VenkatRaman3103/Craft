import { eq } from "drizzle-orm";
import { pages } from "../../db/schema/pages.js";
import { db } from "../server.js";

export async function deletePage(req, res) {
    const pageId = req.params.id;
    try {
        // Delete the page (cascade will delete blocks and field values)
        const response = await db
            .delete(pages)
            .where(eq(pages.page_id, pageId));

        res.status(204).send(response);
    } catch (error) {
        const errorMessage = {
            error,
            message: `Error in deleting the page: ${pageId}`,
            origin: "backend/pagesRouter/DELETE",
        };
        res.status(500).json(errorMessage);
    }
}
