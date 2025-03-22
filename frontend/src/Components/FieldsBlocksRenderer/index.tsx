import React from "react";
import { QueryClient } from "@tanstack/react-query";
import { PageItems } from "../Blocks";
import { FieldsPromt } from "../FieldsPromt";
import { BlocksPropmts } from "../BlocksPromts";
import { AddPageItemsBtn } from "../FieldsAndBlocksList";
import { FieldSelectionPopup } from "../FieldSelectionPopup";
import { BlockSelectionPopup } from "../BlocksSelectionPopup";
import { sampleBlocks } from "@/Data/blocks";
import "./index.scss";
import { sampleFields } from "@/Data/fields";

interface FieldsBlocksRendererProps {
    itemsList: any[];
    query_key_id: string | undefined;
    parentCollectionId: string | null;
    itemType: string;
    queryKey: [string, string | undefined];
    queryClient: QueryClient;
    localFields: any[];

    parentBlockId?: string | undefined;

    // From the custom hook
    showFieldPromt: boolean;
    promtFields: any[];
    isFieldPopupOpen: boolean;
    openFieldPopup: () => void;
    closeFieldPopup: () => void;
    handleAddSelectedFields: (
        selectedFieldIds: any[],
        selectedFieldsType: string,
    ) => void;
    handleFieldsCancel: (promtField: any) => void;
    fieldType: string;

    showBlockPrompt: boolean;
    selectedBlocks: any[];
    isBlockPopupOpen: boolean;
    openBlockPopup: () => void;
    closeBlockPopup: () => void;
    handleBlocksSelected: (newSelectedBlocks: any[]) => void;
    handleBlockPromptCancel: (block: any) => void;
}

export const FieldsBlocksRenderer = ({
    // Component props
    itemsList,
    query_key_id,
    parentCollectionId,
    itemType,
    queryKey,
    queryClient,
    localFields,

    parentBlockId,

    // Hook-derived props
    showFieldPromt,
    promtFields,
    isFieldPopupOpen,
    openFieldPopup,
    closeFieldPopup,
    handleAddSelectedFields,
    handleFieldsCancel,
    fieldType,

    showBlockPrompt,
    selectedBlocks,
    isBlockPopupOpen,
    openBlockPopup,
    closeBlockPopup,
    handleBlocksSelected,
    handleBlockPromptCancel,
}: FieldsBlocksRendererProps) => {
    console.log(itemsList, itemType, "itemsListpage");
    return (
        <div className="fields-blocks-renderer">
            {/* Page Items */}
            <PageItems
                queryClient={queryClient}
                itemsList={itemsList}
                query_key_id={query_key_id}
                parentCollectionId={parentCollectionId}
                itemType={itemType}
                localFields={localFields}
                queryKey={queryKey}
            />

            {/* Fields Prompts */}
            {showFieldPromt && (
                <div className="fields-prompt-container">
                    {promtFields.map((field: any) => (
                        <div key={field.field_id}>
                            <FieldsPromt
                                field={field}
                                queryClient={queryClient}
                                query_key_id={query_key_id}
                                handleFieldsCancel={handleFieldsCancel}
                                fieldType={fieldType}
                                parentBlockId={parentBlockId}
                                queryKey={queryKey}
                                itemType={itemType}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Blocks Prompts */}
            {showBlockPrompt && (
                <div className="blocks-prompt-container">
                    {selectedBlocks.map((block: any) => (
                        <BlocksPropmts
                            key={block.instanceId || block.blockId}
                            localFields={localFields}
                            query_key_id={query_key_id}
                            queryKey={queryKey}
                            block={block}
                            parentBlockId={parentBlockId}
                            page_id={query_key_id || ""}
                            itemType={itemType}
                            queryClient={queryClient}
                            onCancel={() => handleBlockPromptCancel(block)}
                        />
                    ))}
                </div>
            )}

            {/* Add Buttons */}
            <AddPageItemsBtn
                openFieldPopup={openFieldPopup}
                openBlockPopup={openBlockPopup}
                itemType={itemType}
            />

            {/* Popups */}
            <FieldSelectionPopup
                isOpen={isFieldPopupOpen}
                onClose={closeFieldPopup}
                onAddFields={handleAddSelectedFields}
                localFields={localFields}
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
