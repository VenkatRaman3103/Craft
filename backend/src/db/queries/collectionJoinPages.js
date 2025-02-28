import { db } from "../../server/server.js";
import { collectionJoinPages } from "../schema/collectionJoinPages.js";

export async function sampleCollectionJoinPages() {
    try {
        await db.insert(collectionJoinPages).values([
            {
                collection_ref_id: "26e1f4f2-c432-4c86-93fd-6570684b4d96",
                page_ref_id: "e47c9b25-ad8c-4868-9ffb-aa901b7ca184",
            },
            {
                collection_ref_id: "26e1f4f2-c432-4c86-93fd-6570684b4d96",
                page_ref_id: "aba3fe69-82b7-4bcc-8999-6ad792a35ef0",
            },
            {
                collection_ref_id: "26e1f4f2-c432-4c86-93fd-6570684b4d96",
                page_ref_id: "c56c0c2f-61b3-4559-a3b7-d8e71014544a",
            },
        ]);
    } catch (error) {
        console.log(error);
    }
}
