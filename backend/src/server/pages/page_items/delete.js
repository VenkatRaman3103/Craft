import { eq } from "drizzle-orm";
import { page_items } from "../../../db/schema/pages.js";
import { db } from "../../server.js";

export async function deletePageItem(req, res) {
    const { item_id } = req.params;
    try {
        const response = await db
            .delete(page_items)
            .where(eq(page_items.reference_id, item_id));
        res.status(200).json(response);
    } catch (error) {
        const errorMessage = {
            error,
            message: "Error in deleting page item",
            origin: "backend/page_items/DELETE",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
}
