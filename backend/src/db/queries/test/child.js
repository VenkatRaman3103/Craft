import { db } from "../../../server/server.js";
import { child } from "../../schema/child.js";

export async function sampleChild() {
    await db.insert(child).values([
        {
            name: "child 3",
            parent_ref_id: "a2a406dd-a4a0-4f49-9e3b-33e748f9e851",
        },
    ]);
}
