import express from "express";
import { db } from "../server.js";
import { page_items } from "../../db/schema/pages.js";
import { eq } from "drizzle-orm";
import { collectionItems } from "../../db/schema/collections.js";
// import { page_items } from "../../db/schema";

export const move = express.Router();

move.patch(
    "/move/field/:field_id/to/collection/:collection_id",
    async (req, res) => {
        const { field_id, collection_id } = req.params;
        try {
            const pageItemsResponse = await db
                .delete(page_items)
                .where(eq(page_items.reference_id, field_id))
                .returning();

            const collectionItemsResponse = await db
                .insert(collectionItems)
                .values({
                    collection_ref_id: collection_id,
                    item_type: pageItemsResponse[0].item_type,
                    reference_id: field_id,
                })
                .returning();

            res.status(200).json({
                pageItemsResponse,
                collectionItemsResponse,
            });
        } catch (error) {
            const errorMessage = {
                error,
                message:
                    "Error in moving field from page_items to collection_items",
                origin: "backend/move/POST",
            };
            console.log(errorMessage);
            res.status(500).json(errorMessage);
        }
    },
);
