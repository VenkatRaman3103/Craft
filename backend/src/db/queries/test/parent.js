import { db } from "../../../server/server.js";
import { parent } from "../../schema/test/parent.js";

export async function sampleParent() {
    await db.insert(parent).values([
        {
            name: "parent 1",
        },
        {
            name: "parent 2",
        },
    ]);
}
