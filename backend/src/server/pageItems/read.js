import { page_items } from "../../db/schema/pages.js";
import { db } from "../server.js";

export async function readPageItems(req, res) {
    try {
        const response = await db.select().from(page_items);
        res.status(200).json(response);
    } catch (error) {
        const errorMessage = {
            error,
            message: "Error in fetching page_items fields",
            origin: "backend/pageItems/GET",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
}
