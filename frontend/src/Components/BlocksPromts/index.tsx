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
    query_key_id,
    queryKey,
    localFields,
}: any) => {
    const [blockInput, setBlockInput] = useState("");
    const [parentBlockId, setParentBlockId] = useState(null);

    const createBlockMutation = useMutation({
        mutationFn: (blockName) =>
            createBlock(page_id, {
                name: blockName,
                description: "",
                scope: "page",
                blocK_type: "normal_block",
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKey });
        },
        onError: (error) => {
            console.error("Failed to create block:", error);
        },
    });

    const handleCreateBlock = (block) => {
        if (!blockInput) return;
        console.log(block, blockInput, "blockInput");
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
            itemType="block"
            localFields={localFields}
        />
    );
};

// Placeholder for createBlock function if it's not defined elsewhere
const createBlock = async (pageId, blockData) => {
    try {
        const blockResponse = await axios.post(
            `${backendUrl}/block`,
            blockData,
        );

        const pageItemsResponse = await axios.post(
            `${backendUrl}/page/${pageId}/page_items`,
            { reference_id: blockResponse.data.block_id, type: "block" },
        );

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
