import { db } from "../../server/server.js";
import { pages } from "../schema/pages.js";

export async function samplePages() {
    try {
        await db.insert(pages).values({
            page_id: "e7496842-299c-4fc0-9cb6-a7ee32177c2c",
            title: "page title",
        });
    } catch (error) {
        console.log(error);
    }
}
