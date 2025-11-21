import express from "express";
import { pages_versions } from "../../../db/schema/Pages/PagesVersion/schema.js";
import { db } from "../../server.js";
import { eq } from "drizzle-orm";

export const PagesVersionRouter = express.Router();

// get version of the page by its id
PagesVersionRouter.get("/pages-version/:page_id", async (req, res) => {
    const { page_id } = req.params;

    try {
        const reponse = await db
            .select()
            .from(pages_versions)
            .where(eq(pages_versions.page_id, page_id));
        res.json(reponse);
    } catch (error) {
        const errorMessage = {
            origin: "pages_versions/GET -> /pages-version/:page_id",
            error: error,
        };

        console.log(errorMessage);

        res.json(errorMessage);
    }
});

// create a version with the page data: page data -> content_json
PagesVersionRouter.post("/pages-version/:page_id", async (req, res) => {
    const { page_id } = req.params;
    const { version_number, page_data, published_at, created_by } = req.body;

    console.log(
        version_number,
        page_data,
        published_at,
        created_by,
        "<-- body",
    );

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
