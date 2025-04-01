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
}: any) => {
    const [blockInput, setBlockInput] = useState("");

    const createBlockMutation = useMutation({
        mutationFn: (blockName) =>
            createBlock(page_id, itemType, blockName, parentBlockId, block),
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

// Placeholder for createBlock function if it's not defined elsewhere
const createBlock = async (
    page_id,
    itemType,
    blockName,
    parentBlockId,
    block,
) => {
    let payload = {
        name: blockName,
        description: "",
        scope: itemType,
        blocK_type: "block",
        item_type: "block",
    };

    try {
        const blockResponse = await axios.post(`${backendUrl}/block`, payload);

        if (itemType === "page") {
            const pageItemsResponse = await axios.post(
                `${backendUrl}/page/${page_id}/page_items`,
                { reference_id: blockResponse.data.block_id, type: "block" },
            );
        } else if (itemType == "block") {
            const blockItemsResponse = await axios.post(
                `${backendUrl}/block/${parentBlockId}/block_items`,
                {
                    reference_id: blockResponse.data.block_id,
                    parent_block_id: block.block_id,
                    type: itemType,
                },
            );
        }

        // if (itemType === "page") {
        //     const pageItemsResponse = await axios.post(
        //         `${backendUrl}/page/${pageId}/page_items`,
        //         { reference_id: blockResponse.data.block_id, type: "block" },
        //     );
        // } else if (itemType == "block") {
        //     const pageItemsResponse = await axios.post(
        //         `${backendUrl}/page/${pageId}/page_items`,
        //         { reference_id: blockResponse.data.block_id, type: "block" },
        //     );
        // }
    } catch (error) {
        const errorMessage = {
            error: {
                message: error,
            },
        };
        console.error(errorMessage);
    }
};
