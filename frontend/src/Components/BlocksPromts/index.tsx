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

    const handleInputChange = (value) => {
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
                type: block.blockType,
            }}
            handleCreateBlock={handleCreateBlock}
            handleInputChange={(_, value) => handleInputChange(value)}
            handleBlockPromptCancel={onCancel}
        />
    );
};
