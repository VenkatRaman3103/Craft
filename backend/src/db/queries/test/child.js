import { db } from "../../../server/server.js";
import { child } from "../../schema/test/child.js";

export async function sampleChild() {
    await db.insert(child).values([
        {
            name: "child 1",
        },
        {
            name: "child 2",
        },
    ]);
}
