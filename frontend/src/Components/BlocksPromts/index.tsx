import { sampleBlocks } from "@/Data/blocks";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { BlockPrompt } from "../BlockPrompt";

export const BlocksPropmts = ({ block, page_id, queryClient, onCancel }) => {
    const [blockInput, setBlockInput] = useState("");

    const createBlockMutation = useMutation({
        mutationFn: (blockName) =>
            createBlock(page_id, {
                name: blockName,
                description: "",
                scope: "page",
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
        />
    );
};

// Placeholder for createBlock function if it's not defined elsewhere
const createBlock = async (pageId, blockData) => {
    // Implementation of createBlock function
    // This would typically make an API call to create a block
    console.log("Creating block:", blockData, "for page:", pageId);

    // Simulate API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ id: Date.now().toString(), ...blockData });
        }, 500);
    });
};
