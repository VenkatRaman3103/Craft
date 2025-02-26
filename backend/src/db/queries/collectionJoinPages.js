import { db } from "../../server/server.js";
import { collectionJoinPages } from "../schema/collectionJoinPages.js";

export async function sampleCollectionJoinPages() {
    try {
        await db.insert(collectionJoinPages).values({
            collection_ref_id: "1af35b8e-5e8a-4d42-b479-c1b087dc44cb",
            page_ref_id: "e7496842-299c-4fc0-9cb6-a7ee32177c2c",
        });
    } catch (error) {
        console.log(error);
    }
}
