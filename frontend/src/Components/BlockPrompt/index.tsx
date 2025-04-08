import React, { useState, useRef, useEffect } from "react";
import "./index.scss";
import { useFieldsBlocks } from "@/hooks/useFieldsBlocks";
import axios from "axios";
import { backendUrl } from "@/config";
import { ArrayBlockPrompt } from "../BlocksPromts/ArrayBlockPrompt";

export const BlockPrompt = ({
    blockInputs,
    block,
    blockData,
    handleCreateBlock,
    handleInputChange,
    handleBlockPromptCancel,
    localFields,
    parentBlockId,
    queryClient,
    itemType,
}: any) => {
    const [inputWidth, setInputWidth] = useState("auto");
    const inputRef = useRef(null);
    const [blockItemsList, setBlockItemsList] = useState([]);

    useEffect(() => {
        async function fetchBlockItems() {
            const response = await axios.get(
                `${backendUrl}/${block.block_type}/${parentBlockId}`,
            );
            setBlockItemsList(response.data);
        }

        if (parentBlockId) {
            fetchBlockItems();
        }
    }, [parentBlockId]);

    // Use the shared hook for fields and blocks management
    const fieldsBlocksProps = useFieldsBlocks({
        itemType,
        queryClient,
        query_key_id: block.id,
        queryKey: ["blockItems", block.id],
    });

    useEffect(() => {
        if (inputRef.current) {
            const span = document.createElement("span");
            span.textContent = blockInputs[block.id] || "Enter block name";
            span.style.visibility = "hidden";
            span.style.position = "absolute";
            span.style.fontSize = "16px";
            span.style.fontWeight = "500";
            span.style.whiteSpace = "nowrap";
            document.body.appendChild(span);
            const width = span.getBoundingClientRect().width;
            document.body.removeChild(span);
            setInputWidth(`${width + 10}px`);
        }
    }, [blockInputs, block.id]);

    // Function to render prompt based on block type
    function renderPrompt(block) {
        switch (block.type) {
            case "block":
                return "block";
            case "array":
                return <ArrayBlockPrompt block={blockData} />;
            default:
                return "block";
        }
    }

    console.log(itemType, "itemTypeItem");

    return (
        <div className="block-promt-item">
            <div className="block-promt-container">
                <div className="block-promt-wrapper">
                    <div className="block-promt-header-container">
                        <div className="block-promt-header-wrapper">
                            <input
                                className="block-promt-input"
                                ref={inputRef}
                                style={{ width: inputWidth }}
                                value={blockInputs[block.id] || ""}
                                onChange={(e) => {
                                    handleInputChange(block.id, e.target.value);
                                }}
                                placeholder="Enter block name"
                            />
                            <div className="block-promt-type">
                                /{block.type}
                            </div>
                        </div>
                    </div>

                    {renderPrompt(block)}

                    {/* Block content area */}
                    <div className="block-content-area">
                        {/* Use the shared renderer component */}
                        {/* <FieldsBlocksRenderer */}
                        {/*     itemsList={blockItemsList} */}
                        {/*     query_key_id={block.id} */}
                        {/*     parentCollectionId={null} */}
                        {/*     itemType={itemType} */}
                        {/*     parentBlockId={parentBlockId} */}
                        {/*     queryKey={["blockItems", block.id]} */}
                        {/*     queryClient={queryClient} */}
                        {/*     localFields={localFields} */}
                        {/*     {...fieldsBlocksProps} */}
                        {/* /> */}
                    </div>

                    {/* Action buttons */}
                    <div className="action-btn-wrapper">
                        <button
                            className="create-block-button"
                            onClick={() => handleBlockPromptCancel(block)}
                        >
                            Cancel
                        </button>
                        <button
                            className="create-block-button"
                            onClick={() => handleCreateBlock(block, itemType)}
                        >
                            Create Block
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
