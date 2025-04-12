import { backendUrl } from "@/config";
import axios from "axios";

// note: create block
interface Block {
    blockType: "normal" | "array";
}

interface Payload {
    name: string;
    description: string;
    scope: string;
    blocK_type: string;
    item_type: string;
}

export const createBlock = async (
    page_id: string,
    scope: "page" | "block",
    blockName: string,
    parentBlockId: string | null,
    block: Block,
    parentBlockType,
    templateId?: string,
): Promise<void> => {
    console.log(block, scope, parentBlockType, "createBlock");

    const payload: Payload = {
        name: blockName,
        description: "",
        scope,
        blocK_type: block.blockType,
        item_type: block.blockType,
    };

    try {
        const blockResponse = await axios.post(
            `${backendUrl}/${block.blockType}`,
            payload,
        );

        console.log(blockResponse, scope, "blockResponse");

        if (!blockResponse.data.block_id) {
            throw new Error("Block creation failed, no block_id returned.");
        }

        const reference_id = blockResponse.data.block_id;

        if (scope === "page") {
            await createPageItem(page_id, reference_id, block.blockType);
        } else if (scope === "block" || scope === "array") {
            await createBlockItem(
                parentBlockId,
                reference_id,
                block.blockType,
                parentBlockType,
                templateId,
            );
        }
    } catch (error) {
        console.error("Error creating block:", error);
    }
};

export const createPageItem = async (
    page_id: string,
    reference_id: string,
    itemType: string,
) => {
    try {
        await axios.post(`${backendUrl}/page/${page_id}/page_items`, {
            reference_id,
            type: itemType,
        });
    } catch (error) {
        console.error("Error creating page item:", error);
    }
};

export const createBlockItem = async (
    parentBlockId: string,
    reference_id: string,
    blockType: "normal" | "array",
    parentBlockType: string,
    templateId?: string,
) => {
    console.log("entering into createBlockItem");
    try {
        if (blockType === "normal") {
            console.log(
                `${backendUrl}/${blockType}/${parentBlockId}/block_items`,
                "Normal block selected",
            );
            await axios.post(
                `${backendUrl}/${parentBlockType}/${parentBlockId}/block_items`,
                {
                    reference_id,
                    parent_block_id: parentBlockId,
                    type: blockType,
                },
            );
        } else if (blockType === "array") {
            console.log("templateId", templateId);
            await axios.post(
                `${backendUrl}/${parentBlockType}/${parentBlockId}/block_items`,
                {
                    reference_id,
                    parent_block_id: parentBlockId,
                    parent_template_id: templateId,
                    type: blockType,
                },
            );

            // TODO: instead of create new template for each block get the appropriate template and update it
            // await axios.post(`${backendUrl}/array/templates`, {
            //     name: "hello world",
            //     array_block_id: parentBlockId,
            //     array_block_item_id: parentBlockId,
            // });
        }
    } catch (error) {
        console.error("Error creating block item:", error);
    }
};

export async function createArrayBlockTemplate(parentBlockId: string) {
    try {
        await axios.post(`${backendUrl}/array/templates`, {
            name: "hello world",
            array_block_id: parentBlockId,
            array_block_item_id: parentBlockId,
        });
    } catch (error) {
        console.log(error);
    }
}
