import { page_items } from "../../../db/schema/pages.js";
import { db } from "../../server.js";

export async function readPageItems(req, res) {
    try {
        const allPageItems = await db.select().from(page_items);
        res.status(200).json(allPageItems);
    } catch (error) {
        const errorMessage = {
            error,
            message: "Error in fetching page items",
            origin: "backend/page_itemsRouter/GET",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
}
