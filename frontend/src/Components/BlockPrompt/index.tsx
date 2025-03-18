import { useState, useRef, useEffect } from "react";
import "./index.scss";
import { PageItems } from "../Blocks";
import { FieldSelectionPopup } from "../FieldSelectionPopup";
import { BlockSelectionPopup } from "../BlocksSelectionPopup";
import { sampleBlocks } from "@/Data/blocks";
import { sampleFields } from "@/Data/fields";
import { FieldsPromt } from "../FieldsPromt";
import { BlocksPropmts } from "../BlocksPromts";
import { ArrayBlockPrompt } from "../BlocksPromts/ArrayBlockPrompt";
import { AddPageItemsBtn } from "../FieldsAndBlocksList";

export const BlockPrompt = ({
    blockInputs,
    block,
    blockData,
    handleCreateBlock,
    handleInputChange,
    handleBlockPromptCancel, // This is the prop received from parent
    queryClient,
    itemType = "block",
}:any) => {
    const [inputWidth, setInputWidth] = useState("auto");
    const inputRef = useRef(null);

    // States for managing popups and selections
    const [isFieldPopupOpen, setIsFieldPopupOpen] = useState(false);
    const [isBlockPopupOpen, setIsBlockPopupOpen] = useState(false);
    const [showFieldPromt, setShowFieldPromt] = useState(false);
    const [showBlockPrompt, setShowBlockPrompt] = useState(false);
    const [selectedBlocks, setSelectedBlocks] = useState([]);
    const [promtFields, setPromtFields] = useState([]);
    const [fieldType, setFieldType] = useState(itemType);
    const [blockItemsList, setBlockItemsList] = useState([]);

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

    // Handlers for field popup
    const openFieldPopup = () => setIsFieldPopupOpen(true);
    const closeFieldPopup = () => setIsFieldPopupOpen(false);

    // Handlers for block popup
    const openBlockPopup = () => setIsBlockPopupOpen(true);
    const closeBlockPopup = () => setIsBlockPopupOpen(false);

    // Handler for adding selected fields
    const handleAddSelectedFields = (selectedFieldIds, selectedFieldsType) => {
        setFieldType(selectedFieldsType);

        if (selectedFieldsType === "all") {
            const fieldsToAdd = sampleFields
                .filter((field) => selectedFieldIds.includes(field.id))
                .map((field) => ({
                    field_id: `${field.id}-${Date.now()}`,
                    name: field.name,
                    type: field.type,
                }));

            setPromtFields([...promtFields, ...fieldsToAdd]);
        } else if (selectedFieldsType === "local") {
            // Implement local fields handling if needed
            const fieldsToAdd = [];
            setPromtFields([...promtFields, ...fieldsToAdd]);
        }

        if (selectedFieldIds.length > 0) {
            setShowFieldPromt(true);
        }
    };

    // Handler for block selection
    const handleBlocksSelected = (newSelectedBlocks) => {
        setSelectedBlocks((prev) => [...prev, ...newSelectedBlocks]);

        if (newSelectedBlocks.length > 0) {
            setShowBlockPrompt(true);
        }
    };

    // Handlers for canceling prompts
    const handleFieldsCancel = (promtField) => {
        setPromtFields((prev) =>
            prev.filter((field) => field.field_id !== promtField.field_id),
        );

        if (promtFields.length <= 1) {
            setShowFieldPromt(false);
        }
    };

    // Renamed from handleBlockPromptCancel to handleInternalBlockCancel to avoid conflict
    const handleInternalBlockCancel = (blockToCancel) => {
        setSelectedBlocks((prev) =>
            prev.filter(
                (b) =>
                    (b.instanceId || b.blockId) !==
                    (blockToCancel.instanceId || blockToCancel.blockId),
            ),
        );

        if (selectedBlocks.length <= 1) {
            setShowBlockPrompt(false);
        }
    };

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
                        {/* Page Items list */}
                        <PageItems
                            queryClient={queryClient}
                            itemsList={blockItemsList}
                            query_key_id={block.id}
                            parentCollectionId={null}
                            itemType={itemType}
                            queryKey={["blockItems", block.id]}
                        />

                        {/* Field Prompts */}
                        {showFieldPromt && (
                            <div className="fields-prompt-container">
                                {promtFields.map((field) => (
                                    <div key={field.field_id}>
                                        <FieldsPromt
                                            field={field}
                                            queryClient={queryClient}
                                            query_key_id={block.id}
                                            handleFieldsCancel={
                                                handleFieldsCancel
                                            }
                                            fieldType={fieldType}
                                            queryKey={["blockItems", block.id]}
                                            itemType={itemType}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Block Prompts */}
                        {showBlockPrompt && (
                            <div className="blocks-prompt-container">
                                {selectedBlocks.map((selectedBlock) => (
                                    <BlocksPropmts
                                        key={
                                            selectedBlock.instanceId ||
                                            selectedBlock.blockId
                                        }
                                        block={selectedBlock}
                                        page_id={block.id}
                                        queryClient={queryClient}
                                        onCancel={() =>
                                            handleInternalBlockCancel(
                                                selectedBlock,
                                            )
                                        }
                                    />
                                ))}
                            </div>
                        )}

                        {/* Add buttons */}
                        <AddPageItemsBtn
                            openFieldPopup={openFieldPopup}
                            openBlockPopup={openBlockPopup}
                            itemType={itemType}
                        />
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
                            onClick={() => handleCreateBlock(block)}
                        >
                            Create Block
                        </button>
                    </div>
                </div>
            </div>

            {/* Popups */}
            <FieldSelectionPopup
                isOpen={isFieldPopupOpen}
                onClose={closeFieldPopup}
                onAddFields={handleAddSelectedFields}
                localFields={[]} // Pass local fields if needed
                availableFields={sampleFields}
            />

            <BlockSelectionPopup
                isOpen={isBlockPopupOpen}
                onClose={closeBlockPopup}
                availableBlocks={sampleBlocks}
                onBlocksSelected={handleBlocksSelected}
            />
        </div>
    );
};
