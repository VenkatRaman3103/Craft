import express from "express";
import { pages_versions } from "../../../db/schema/Pages/PagesVersion/schema.js";
import { db } from "../../server.js";
import { desc, eq } from "drizzle-orm";
import { sections } from "../../../db/schema/index.js";

export const PagesVersionRouter = express.Router();

// get version by its id
PagesVersionRouter.get("/pages-version/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const reponse = await db
            .select()
            .from(pages_versions)
            .where(eq(pages_versions.id, id));
        res.json(reponse[0]);
    } catch (error) {
        const errorMessage = {
            origin: "pages_versions/GET -> /pages-version/:id",
            error: error,
        };

        console.log(errorMessage);

        res.json(errorMessage);
    }
});

// get version of the page by its id
PagesVersionRouter.get("/pages-version/:page_id/page", async (req, res) => {
    const { page_id } = req.params;

    try {
        const reponse = await db
            .select()
            .from(pages_versions)
            .where(eq(pages_versions.page_id, page_id))
            .orderBy(desc(pages_versions.published_at));

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
    const { page_data, published_at, created_by, message } = req.body;

    try {
        const reponse = await db
            .insert(pages_versions)
            .values({
                page_id,
                content_json: page_data,
                published_at,
                created_by,
                message,
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

// update the relavant table with the content_json
PagesVersionRouter.get("/pages-version/:id/revert", async (req, res) => {
    const { id } = req.params;

    try {
        const [version] = await db
            .select()
            .from(pages_versions)
            .where(eq(pages_versions.id, id));

        if (!version) {
            return res.status(404).json({ error: "Version not found" });
        }

        const contentData =
            typeof version.content_json === "string"
                ? JSON.parse(version.content_json)
                : version.content_json;

        const sections_data = contentData.items.filter(
            (item) => item.item_type === "section",
        );

        const pageId = contentData.id;

        await db.transaction(async (tx) => {
            await tx
                .delete(sections)
                .where(eq(sections.parent_page_id, pageId));

            for (let s of sections_data) {
                await tx.insert(sections).values({
                    id: s.id,
                    name: s.name,
                    item_type: s.item_type,
                    parent_page_id: s.parent_page_id,
                    type: s.type,
                    position: s.position,
                    created_at: new Date(s.created_at),
                    updated_at: new Date(s.updated_at),
                });
            }
        });

        res.json({
            success: true,
            version,
            sectionsRestored: sections_data.length,
        });
    } catch (error) {
        console.error("Revert error:", error);
        res.status(500).json({
            origin: "pages_versions/POST -> /pages-version/:id/revert",
            error: error.message,
        });
    }
});
