import { db, pool } from "../../server/server.js";
import { collections } from "../schema/collection.js";

export async function sampleCollections() {
    try {
        await db.insert(collections).values([
            { name: "Home", status: "publish", slug: "/home" },
            { name: "About", status: "draft", slug: "/about" },
        ]);

        console.log("Sample collections inserted successfully!");
    } catch (error) {
        console.error("Error in creating sampleCollections:", error);
    } finally {
        await pool.end();
    }
}
