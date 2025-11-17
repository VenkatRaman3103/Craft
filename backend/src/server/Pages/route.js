import express from "express";
import { pages } from "../../db/schema/Pages/schema.js";
import { db } from "../server.js";
import { eq } from "drizzle-orm";
import { sections } from "../../db/schema/index.js";

export const PagesRouter = express.Router();

PagesRouter.get("/pages", (req, res) => {
    res.json("hello from pages");
});

PagesRouter.post("/pages/:parent_element_id/element", async (req, res) => {
    const { parent_element_id } = req.params;

    const { name, description, slug } = req.body;

    try {
        const reponse = await db
            .insert(pages)
            .values([
                {
                    name,
                    description,
                    slug,
                    parent_element_id,
                },
            ])
            .returning();
        res.json(reponse);
    } catch (error) {
        const errorMessage = {
            origin: "pages/POST -> /pages/:parent_element_id/element",
            error: error,
        };

        console.log(errorMessage);

        res.json(errorMessage);
    }
});

PagesRouter.get("/pages/:parent_element_id/element", async (req, res) => {
    const { parent_element_id } = req.params;

    try {
        const reponse = await db
            .select()
            .from(pages)
            .where(eq(pages.parent_element_id, parent_element_id));
        res.json(reponse);
    } catch (error) {
        const errorMessage = {
            origin: "pages/GET -> /pages/:parent_element_id/element",
            error: error,
        };

        console.log(errorMessage);

        res.json(errorMessage);
    }
});

PagesRouter.get("/pages/:page_id", async (req, res) => {
    const { page_id } = req.params;

    try {
        const reponse = await db
            .select()
            .from(pages)
            .where(eq(pages.id, page_id));

        const sectionResponse = await db
            .select()
            .from(sections)
            .where(eq(sections.parent_page_id, page_id));

        res.json({ ...reponse, items: [...sectionResponse] });
    } catch (error) {
        const errorMessage = {
            origin: "pages/GET -> /pages/:page_id",
            error: error,
        };

        console.log(errorMessage);

        res.json(errorMessage);
    }
});
