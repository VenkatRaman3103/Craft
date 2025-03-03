import { db } from "../../server/server.js";
import { pages } from "../schema/pages.js";
import { v4 as uuidv4 } from "uuid";

export async function samplePages() {
    try {
        await db.insert(pages).values({
            page_id: "5112c791-4778-49c3-bffe-9d35f0904784",
            title: "page title 1",
            slug: "test-slug",
        });
    } catch (error) {
        console.log(error);
    }
}
