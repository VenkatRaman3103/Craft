import { db } from "../../server/server.js";
import { collectionJoinPages } from "../schema/collectionJoinPages.js";

export async function sampleCollectionJoinPages() {
    try {
        await db.insert(collectionJoinPages).values({
            collection_ref_id: "e27e8d79-6eb8-4274-bb7b-711f82ddf933",
            page_ref_id: "3dc92354-52d6-4d0f-b80b-edb174a4bbfc",
        });
    } catch (error) {
        console.log(error);
    }
}
