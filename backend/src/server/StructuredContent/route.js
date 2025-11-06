import express from "express";
import { db } from "../server.js";
import { groups } from "../../db/schema/Groups/schema.js";
import { collections } from "../../db/schema/Collections/schema.js";
import { eq } from "drizzle-orm";
import { elements } from "../../db/schema/Elements/schema.js";
import { pages } from "../../db/schema/Pages/schema.js";

export const StructuredContentRouter = express.Router();

StructuredContentRouter.get("/structured-content", async (req, res) => {
    try {
        let result = [];

        const allGroups = await db.select().from(groups);

        for (let group of allGroups) {
            let colResult = [];

            const childCollections = await db
                .select()
                .from(collections)
                .where(eq(collections.group_id, group.id));

            for (let col of childCollections) {
                let elementList = [];

                const eleRes = await db
                    .select()
                    .from(elements)
                    .where(eq(elements.parent_col_id, col.id));

                for (let ele of eleRes) {
                    const pageList = await db
                        .select()
                        .from(pages)
                        .where(eq(pages.parent_element_id, ele.id));

                    elementList.push({ ...ele, pages: pageList });
                }

                colResult.push({ ...col, elements: elementList });
            }

            result.push({ ...group, collections: colResult });
        }

        res.json(result);
    } catch (error) {
        res.json({
            origin: "structured-content/GET -> /structured-content",
            error,
        });
    }
});
