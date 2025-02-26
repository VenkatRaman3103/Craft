import { db } from "../../server/server.js";
import { collectionJoinPages } from "../schema/collectionJoinPages.js";

export async function sampleCollectionJoinPages() {
    try {
        await db.insert(collectionJoinPages).values({
            collection_ref_id: "1af35b8e-5e8a-4d42-b479-c1b087dc44cb",
            page_ref_id: "5112c791-4778-49c3-bffe-9d35f0904784",
        });
    } catch (error) {
        console.log(error);
    }
}
