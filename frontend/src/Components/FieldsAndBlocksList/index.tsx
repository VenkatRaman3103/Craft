import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { sampleFields } from "@/Data/fields";
import { useFieldsBlocks } from "@/hooks/useFieldsBlocks";
import { FieldsBlocksRenderer } from "../FieldsBlocksRenderer";
import { AddBtn } from "../Buttons/AddBtn";

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

// Keep this export since it's used elsewhere
export const AddPageItemsBtn = ({
    openFieldPopup,
    openBlockPopup,
    itemType,
}: {
    openFieldPopup: () => void;
    openBlockPopup: () => void;
    itemType: string;
}) => {
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
        </div>
    );
};
