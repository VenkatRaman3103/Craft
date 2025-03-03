import { pages } from "../../db/schema/pages.js";
import { db } from "../server.js";

export async function createPage(req, res) {
    try {
        const { title, slug, page_id } = req.body;

        if (!title || !slug) {
            return res
                .status(400)
                .json({ error: "Title and slug are required" });
        }

        // Create the page
        const newPage = await db
            .insert(pages)
            .values({
                title,
                slug,
                page_id,
            })
            .returning();

        res.status(201).json(newPage[0]);
    } catch (error) {
        const erroMessage = {
            error,
            message: `Error in creating the page`,
            origin: "backend/pagesRouter/POST",
        };
        res.status(500).json(erroMessage);
    }
}
