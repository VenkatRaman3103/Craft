import { referenceBlock } from "../../../db/schema/blocks/referenceBlock/schema.js";
import { collections } from "../../../db/schema/collections.js";
import { getPages, getPagesForCollection } from "../../collection/read.js";
import { db } from "../../server.js";

export const getAllReferenceBlocks = async (req, res) => {
    try {
        const allReferenceBlocks = await db.select().from(referenceBlock);
        res.json(allReferenceBlocks);
    } catch (error) {
        const errorMessage = {
            error: error.message,
            origin: "backend/getAllReferenceBlocks/read/GET",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
};

export const getReferenceBlock = async (req, res) => {
    const { block_id } = req.params;

    try {
        const referenceBlock = await db.query.referenceBlock.findFirst({
            where: (block, { eq }) => eq(block.block_id, block_id),
        });
        const collectionsList = await db.select().from(collections);

        const collectionWithPages = await Promise.all(
            collectionsList.map(async (collection) => {
                const pages = await getPages(collection.collection_id);
                console.log(pages, "pages");
                return {
                    ...collection,
                    pages: pages.map((page) => page.pages),
                };
            }),
        );

        console.log(collectionWithPages, "collectionWithPages");

        res.json({ ...referenceBlock, collectionsList: collectionWithPages });
    } catch (error) {
        const errorMessage = {
            error: error.message,
            origin: "backend/getAllReferenceBlocks/read/GET",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
};
