import { sampleBlocks } from "@/Data/blocks";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { BlockPrompt } from "../BlockPrompt";
import axios from "axios";
import { backendUrl } from "@/config";
import { createBlock } from "@/api/createBlock";

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
