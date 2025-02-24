import { db, pool } from "../../server/server.js";
import { collections } from "../schema/collections.js";

export async function sampleCollections() {
    try {
        await db.insert(collections).values([
            {
                name: "Nested DB",
                status: "publish",
                slug: "/home",
                reference_id: "c9c5ede7-df2b-4273-9412-1a87e64c8dc0",
            },
        ]);

        console.log("Sample collections inserted successfully!");
    } catch (error) {
        console.error("Error in creating sampleCollections:", error);
    } finally {
        await pool.end();
    }
}
