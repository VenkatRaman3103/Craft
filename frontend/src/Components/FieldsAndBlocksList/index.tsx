// BlocksListContainer.tsx
import { useState } from "react";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { sampleFields } from "@/Data/fields";
import { PageItems } from "../Blocks";
import { FieldsPromt } from "../FieldsPromt";
import { BlocksPropmts } from "../BlocksPromts";
import { FieldSelectionPopup } from "../FieldSelectionPopup";
import { BlockSelectionPopup } from "../BlocksSelectionPopup";
import { sampleBlocks } from "@/Data/blocks";
import { AddBtn } from "../Buttons/AddBtn";
import { field } from "@/Types/fields";

interface BlocksListContainerProps {
    itemsList: any;
    query_key_id: string | undefined;
    parentCollectionId: string | null;
    itemType: string;
    queryKey: [string, string | undefined];
    localFields: any;
}

interface fieldPromt {
    id: string;
    name: string;
    type: string;
}

export const FieldsAndBlocksList = ({
    itemsList,
    query_key_id,
    parentCollectionId,
    itemType,
    queryKey,
    localFields,
}: BlocksListContainerProps) => {
    const queryClient = useQueryClient();
    const [showFieldPromt, setShowFieldPromt] = useState(false);
    const [showBlockPrompt, setShowBlockPrompt] = useState(false);
    const [selectedBlocks, setSelectedBlocks] = useState<any>([]);
    const [isFieldPopupOpen, setIsFieldPopupOpen] = useState(false);
    const [isBlockPopupOpen, setIsBlockPopupOpen] = useState(false);
    const [promtFields, setPromtFields] = useState<any[]>([]);

    const [fieldType, setFieldType] = useState(itemType);

    const handleAddSelectedFields = (
        selectedFieldIds: any[],
        selectedFieldsType: string,
    ) => {
        setFieldType(selectedFieldsType);

        if (selectedFieldsType == "all") {
            const fieldsToAdd = sampleFields
                .filter((field) => selectedFieldIds.includes(field.id))
                .map((field) => ({
                    field_id: `${field.id}-${Date.now()}`,
                    name: field.name,
                    type: field.type,
                }));

            setPromtFields([...promtFields, ...fieldsToAdd]);
        } else if (selectedFieldsType == "local") {
            const fieldsToAdd = localFields
                .filter((field: any) =>
                    selectedFieldIds.includes(field[field.item_type].field_id),
                )
                .map((field: any) => field[field.item_type]);

            console.log(localFields, "localFields");
            setPromtFields([...promtFields, ...fieldsToAdd]);
        }

        if (selectedFieldIds.length > 0) {
            setShowFieldPromt(true);
        }
    };

    const closeFieldPopup = () => {
        setIsFieldPopupOpen(false);
    };

    const openFieldPopup = () => {
        setIsFieldPopupOpen(true);
    };

    const closeBlockPopup = () => {
        setIsBlockPopupOpen(false);
    };

    const openBlockPopup = () => {
        setIsBlockPopupOpen(true);
    };

    const handleBlocksSelected = (newSelectedBlocks: any) => {
        setSelectedBlocks((prev: any) => [...prev, ...newSelectedBlocks]);

        if (newSelectedBlocks.length > 0) {
            setShowBlockPrompt(true);
        }
    };

    const handleBlockPromptCancel = (block: any) => {
        setSelectedBlocks((prev: any) =>
            prev.filter(
                (b: any) =>
                    (b.instanceId || b.blockId) !==
                    (block.instanceId || block.blockId),
            ),
        );

        if (selectedBlocks.length <= 1) {
            setShowBlockPrompt(false);
        }
    };

    function handleFieldsCancel(promtField: fieldPromt) {
        setPromtFields((prev: fieldPromt[]) =>
            prev.filter((field) => field.id !== promtField.id),
        );

        if (promtFields.length <= 1) {
            setShowFieldPromt(false);
        }
    }

    console.log(promtFields, "promtFields");

    return (
        <div className="blocks-list-container">
            <div className="blocks-list-wrapper">
                <PageItems
                    queryClient={queryClient}
                    itemsList={itemsList}
                    query_key_id={query_key_id}
                    parentCollectionId={parentCollectionId}
                    itemType={itemType}
                    queryKey={queryKey}
                />

                {showFieldPromt && (
                    <div className="fields-prompt-container">
                        {promtFields.map((field: fieldPromt) => (
                            <div key={field.id}>
                                <FieldsPromt
                                    field={field}
                                    queryClient={queryClient}
                                    query_key_id={query_key_id}
                                    handleFieldsCancel={handleFieldsCancel}
                                    fieldType={fieldType}
                                    queryKey={queryKey}
                                    itemType={itemType}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {showBlockPrompt && (
                    <div className="blocks-prompt-container">
                        {selectedBlocks.map((block: any) => (
                            <BlocksPropmts
                                key={block.instanceId || block.blockId}
                                block={block}
                                page_id={""}
                                queryClient={queryClient}
                                onCancel={() => handleBlockPromptCancel(block)}
                            />
                        ))}
                    </div>
                )}

                <AddPageItemsBtn
                    openFieldPopup={openFieldPopup}
                    openBlockPopup={openBlockPopup}
                    itemType={itemType}
                />

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
        </div>
    );
};

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

            {itemType != "collection" && (
                <div onClick={openBlockPopup} className="btn">
                    <AddBtn iconLable="Add Blocks" />
                </div>
            )}
        </div>
    );
};
