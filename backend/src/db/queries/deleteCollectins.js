import { db } from "../../server/server.js";
import { collections } from "../schema/collections.js";

export async function deleteCollections() {
    try {
        await db.delete(collections);
    } catch (error) {
        console.log(error);
    }
}
