import express from "express";
import { pages_versions } from "../../../db/schema/Pages/PagesVersion/schema.js";
import { db } from "../../server.js";

export const PagesVersionRouter = express.Router();

// get version of the page by its id
// create a version with the page data: page data -> content_json
PagesVersionRouter.post("/pages-version/:page_id", async (req, res) => {
    const { page_id } = req.params;
    const { version_number, page_data, published_at, created_by } = req.body;
    console.log(req.body, "<- body");

    try {
        const reponse = await db
            .insert(pages_versions)
            .values({
                page_id,
                version_number,
                content_json: page_data,
                published_at,
                created_by,
            })
            .returning();
        res.json(reponse);
    } catch (error) {
        const errorMessage = {
            origin: "pages_versions/POST -> /pages-version/:page_id",
            error: error,
        };

        console.log(errorMessage);

        res.json(errorMessage);
    }
});
