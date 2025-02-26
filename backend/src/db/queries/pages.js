import { db } from "../../server/server.js";
import { pages } from "../schema/pages.js";

export async function samplePages() {
    try {
        await db.insert(pages).values({
            page_id: "5112c791-4778-49c3-bffe-9d35f0904784",
            title: "page title 1",
        });
    } catch (error) {
        console.log(error);
    }
}
