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
    localFields,
}: any) => {
    const [blockInput, setBlockInput] = useState("");

    const createBlockMutation = useMutation({
        mutationFn: (blockName) =>
            createBlock(page_id, {
                name: blockName,
                description: "",
                scope: "page",
                blocK_type: "normal_block",
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["pageData", page_id] });
        },
        onError: (error) => {
            console.error("Failed to create block:", error);
        },
    });

    const handleCreateBlock = () => {
        if (!blockInput) return;
        console.log(blockInput, "blockInput");
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
            handleCreateBlock={handleCreateBlock}
            handleInputChange={handleInputChange}
            handleBlockPromptCancel={onCancel}
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

        console.log(blockResponse, "blockResponse");

        const pageItemsResponse = await axios.post(
            `${backendUrl}/page/${pageId}/page_items`,
            { reference_id: blockResponse.data.block_id, type: "block" },
        );
        console.log(pageItemsResponse, "pageItemsResponse");
    } catch (error) {
        const errorMessage = {
            error: {
                message: error,
            },
        };
        console.error(errorMessage);
    }
};
