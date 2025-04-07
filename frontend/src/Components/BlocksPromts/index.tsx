import { sampleBlocks } from "@/Data/blocks";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { BlockPrompt } from "../BlockPrompt";
import axios from "axios";
import { backendUrl } from "@/config";

export const BlocksPropmts = ({
    block,
    page_id,
    queryClient,
    onCancel,
    itemType,
    query_key_id,
    queryKey,
    localFields,
    parentBlockId,
    parentBlockType,
}: any) => {
    const [blockInput, setBlockInput] = useState("");

    const createBlockMutation = useMutation({
        mutationFn: (blockName) =>
            createBlock(
                page_id,
                itemType,
                blockName,
                parentBlockId,
                block,
                parentBlockType,
            ),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKey });
        },
        onError: (error) => {
            console.error("Failed to create block:", error);
        },
    });

    const handleCreateBlock = (block, itemType) => {
        if (!blockInput) return;
        console.log(block, blockInput, itemType, "blockInput");
        console.log(queryKey, "queryKey");
        createBlockMutation.mutate(blockInput);
        onCancel();
    };

    const handleInputChange = (_, value) => {
        setBlockInput(value);
    };

    const blockDetails = sampleBlocks.find((b) => b.id === block.blockId);

    if (!blockDetails) return null;

    return (
        <BlockPrompt
            blockInputs={{ [block.instanceId || block.blockId]: blockInput }}
            blockData={block}
            block={{
                id: block.instanceId || block.blockId,
                name: blockDetails.name,
                type: block.blockType || "block",
            }}
            page_id={page_id}
            handleCreateBlock={handleCreateBlock}
            handleInputChange={handleInputChange}
            handleBlockPromptCancel={onCancel}
            parentBlockId={block.block_id}
            queryClient={queryClient}
            itemType={block.blockType}
            localFields={localFields}
        />
    );
};

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

const createBlock = async (
    page_id: string,
    scope: "page" | "block",
    blockName: string,
    parentBlockId: string | null,
    block: Block,
    parentBlockType,
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

        console.log(blockResponse, "blockResponse");

        if (!blockResponse.data.block_id) {
            throw new Error("Block creation failed, no block_id returned.");
        }

        const reference_id = blockResponse.data.block_id;

        if (scope === "page") {
            await createPageItem(page_id, reference_id, block.blockType);
        } else if (scope === "block" && parentBlockId) {
            await createBlockItem(
                parentBlockId,
                reference_id,
                block.blockType,
                parentBlockType,
            );
        }
    } catch (error) {
        console.error("Error creating block:", error);
    }
};

const createPageItem = async (
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

const createBlockItem = async (
    parentBlockId: string,
    reference_id: string,
    blockType: "normal" | "array",
    parentBlockType: string,
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
            console.log("Normal block selected");
            await axios.post(
                `${backendUrl}/${parentBlockType}/${parentBlockId}/block_items`,
                {
                    reference_id,
                    parent_block_id: parentBlockId,
                    type: blockType,
                },
            );
        }
    } catch (error) {
        console.error("Error creating block item:", error);
    }
};
