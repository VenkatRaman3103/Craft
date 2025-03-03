import { db } from "../../server/server.js";
import { blocks } from "../schema/blocks.js";

export async function sampleBlocks() {
    try {
        await db.insert(blocks).values([
            {
                block_id: "698bea20-fbaf-4f31-b284-8c5cfa429e66",
                name: "block 1",
                scope: "global",
                description: "This is a custom block",
                reference_id: "c2937bda-026d-46e3-b9ca-c2cbe43fc67d",
            },
            {
                block_id: "950daaa7-a56c-422a-bb59-c9811e6618c6",
                name: "block 2",
                scope: "page",
                description: "This is a custom block",
                reference_id: "c2937bda-026d-46e3-b9ca-c2cbe43fc67d",
            },
            {
                block_id: "5ac04495-334f-4d2d-aaf2-a6f727b4cb89",
                name: "block 3",
                scope: "collection",
                description: "This is a custom block",
                reference_id: "c2937bda-026d-46e3-b9ca-c2cbe43fc67d",
            },
            {
                block_id: "a0dd9892-a5de-4b8a-a9ea-ed9264de9cb5",
                name: "block 4",
                scope: "collection",
                description: "This is a custom block",
                reference_id: "c2937bda-026d-46e3-b9ca-c2cbe43fc67d",
            },
            {
                block_id: "097c7d5d-98e5-4dce-abef-f76b139cff64",
                name: "block 3",
                scope: "global",
                description: "This is a custom block",
                reference_id: "c2937bda-026d-46e3-b9ca-c2cbe43fc67d",
            },
            {
                block_id: "afec7e28-5f32-49a4-aefe-f24d8777c2b3",
                name: "block 4",
                scope: "page",
                description: "This is a custom block",
                reference_id: "c2937bda-026d-46e3-b9ca-c2cbe43fc67d",
            },
            {
                block_id: "ea1774d8-24cc-41ac-b0b4-e172eca362d7",
                name: "block 5",
                scope: "collection",
                description: "This is a custom block",
                reference_id: "c2937bda-026d-46e3-b9ca-c2cbe43fc67d",
            },
        ]);
    } catch (error) {
        const errorMessage = {
            error,
            message: `Error in creating the blocks`,
            origin: "backend/blocksRouter/POST",
        };
        console.log(errorMessage);
    }
}
