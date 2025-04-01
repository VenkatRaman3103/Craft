import { db } from "../../../server/server.js";
import { arrayBlocks } from "../../schema/blocks.js";

export const createArrayBlocks = async () => {
    try {
        const response = await db.insert(arrayBlocks).values([
            {
                block_id: "755c9b08-9c75-402e-b3b4-3e7bd4c229de",
                name: "block 2",
                scope: "global",
                description: "This is a custom block 1",
                reference_id: "b7738f6b-1e8d-42b5-8be5-e831a6e4388b",
            },
        ]);
        console.log(response);
    } catch (error) {
        console.log(error);
    }
};
