import { useQueryClient } from "@tanstack/react-query";
import { useFieldsBlocks } from "@/hooks/useFieldsBlocks";
import { FieldsBlocksRenderer } from "../FieldsBlocksRenderer";
import { AddBtn } from "../Buttons/AddBtn";
import { useState } from "react";

interface FieldsAndBlocksListProps {
    itemsList: any[];
    query_key_id: string | undefined;
    parentCollectionId: string | null;
    itemType: string;
    queryKey: [string, string | undefined];
    localFields: any[];
}

export const FieldsAndBlocksList = ({
    itemsList,
    query_key_id,
    parentCollectionId,
    itemType,
    queryKey,
    localFields,
}: FieldsAndBlocksListProps) => {
    const queryClient = useQueryClient();

    // Use the custom hook to manage fields and blocks
    const fieldsBlocksProps = useFieldsBlocks({
        itemType,
        queryClient,
        query_key_id,
        queryKey,
    });

    return (
        <div className="blocks-list-container">
            <div className="blocks-list-wrapper">
                <FieldsBlocksRenderer
                    itemsList={itemsList}
                    query_key_id={query_key_id}
                    parentCollectionId={parentCollectionId}
                    itemType={itemType}
                    queryKey={queryKey}
                    queryClient={queryClient}
                    localFields={localFields}
                    {...fieldsBlocksProps}
                />
            </div>
        </div>
    );
};

export const AddPageItemsBtn = ({
    openFieldPopup,
    openBlockPopup,
    itemType,
    isVerbose = true, // New prop with default value true
}: {
    openFieldPopup: () => void;
    openBlockPopup: () => void;
    itemType: string;
    isVerbose?: boolean; // Optional prop
}) => {
    const [showOptions, setShowOptions] = useState(false);

    // Function to handle clicking the plus button in minimal mode
    const handlePlusClick = () => {
        setShowOptions((prev) => !prev);
    };

    if (isVerbose) {
        // Verbose mode - original UI
        return (
            <div className="add-button-wrapper">
                <div onClick={openFieldPopup} className="btn">
                    <AddBtn iconLable="Add Field" />
                </div>
                {itemType !== "collection" && (
                    <div onClick={openBlockPopup} className="btn">
                        <AddBtn iconLable="Add Blocks" />
                    </div>
                )}
                <p>{itemType}</p>
            </div>
        );
    } else {
        // Minimal mode - hidden until hover, with popup options
        return (
            <div className="add-button-wrapper minimal">
                <div className="minimal-plus-container">
                    <div onClick={handlePlusClick} className="minimal-plus-btn">
                        <span>+</span>
                    </div>

                    {showOptions && (
                        <div className="options-popup">
                            <div
                                onClick={() => {
                                    openFieldPopup();
                                    setShowOptions(false);
                                }}
                                className="popup-btn"
                            >
                                <AddBtn iconLable="Add Field" />
                            </div>
                            {itemType !== "collection" && (
                                <div
                                    onClick={() => {
                                        openBlockPopup();
                                        setShowOptions(false);
                                    }}
                                    className="popup-btn"
                                >
                                    <AddBtn iconLable="Add Blocks" />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }
};
