import { useQueryClient } from "@tanstack/react-query";
import { useFieldsBlocks } from "@/hooks/useFieldsBlocks";
import { AddBtn } from "../Buttons/AddBtn";
import { useState } from "react";
import { FieldsBlocksRenderer } from "../FieldsBlocksRenderer";

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
                    parentBlockType={itemType}
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
    isVerbose = true,
}: {
    openFieldPopup: () => void;
    openBlockPopup: () => void;
    itemType: string;
    isVerbose?: boolean;
}) => {
    const [showOptions, setShowOptions] = useState(false);

    const handlePlusClick = () => {
        setShowOptions((prev) => !prev);
    };

    if (isVerbose) {
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
