import express from "express";
import { getPageDatById } from "../../pages/read.js";
import { getBlockWithNestedContent } from "../../blocks/read.js";

export const apiService = express.Router();

async function getPageItemsData(data) {
    const pageItems = data.page_items;

    const blocks = await Promise.all(
        pageItems.map(async (item) => {
            let foo;
            if (item.item_type == "normal") {
                foo = await getBlockWithNestedContent(item.normal.block_id);
            }

            return foo;
        }),
    );
    console.log(blocks);
    return blocks;
}

apiService.get("/api/page/:page_id", async (req, res) => {
    const { page_id } = req.params;
    const page = await getPageDatById(page_id);

    const pageItems = await getPageItemsData(page);

    res.json(pageItems);
});
