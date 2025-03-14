// BlocksListContainer.tsx
import { useState } from "react";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { sampleFields } from "@/Data/fields";
import { PageItems } from "../Blocks";
import { FieldsPromt } from "../FieldsPromt";
import { BlocksPropmts } from "../BlocksPromts";
import { AddPageItemsBtn } from "@/Pages/Page";
import { FieldSelectionPopup } from "../FieldSelectionPopup";
import { BlockSelectionPopup } from "../BlocksSelectionPopup";
import { sampleBlocks } from "@/Data/blocks";

interface BlocksListContainerProps {
    pageData: any;
    page_id: string;
    parentCollectionId: string | null;
}

interface fieldPromt {
    id: string;
    name: string;
    type: string;
}

export const FieldsAndBlocksList = ({
    pageData,
    page_id,
    parentCollectionId,
}: BlocksListContainerProps) => {
    const queryClient = useQueryClient();
    const [showFieldPromt, setShowFieldPromt] = useState(false);
    const [showBlockPrompt, setShowBlockPrompt] = useState(false);
    const [selectedBlocks, setSelectedBlocks] = useState([]);
    const [isFieldPopupOpen, setIsFieldPopupOpen] = useState(false);
    const [isBlockPopupOpen, setIsBlockPopupOpen] = useState(false);
    const [promtFields, setPromtFields] = useState<fieldPromt[]>([]);

    const handleAddSelectedFields = (selectedFieldIds: string[]) => {
        const fieldsToAdd = sampleFields
            .filter((field) => selectedFieldIds.includes(field.id))
            .map((field) => ({
                id: `${field.id}-${Date.now()}`,
                name: field.name,
                type: field.type,
            }));

        setPromtFields([...promtFields, ...fieldsToAdd]);

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

    const handleBlocksSelected = (newSelectedBlocks) => {
        setSelectedBlocks((prev) => [...prev, ...newSelectedBlocks]);

        if (newSelectedBlocks.length > 0) {
            setShowBlockPrompt(true);
        }
    };

    const handleBlockPromptCancel = (block) => {
        setSelectedBlocks((prev) =>
            prev.filter(
                (b) =>
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

    console.log(selectedBlocks, "selectedBlocks");
    console.log(promtFields, "promtfields");
    console.log(parentCollectionId, "parentCollectionId");

    return (
        <div className="blocks-list-container">
            <div className="blocks-list-wrapper">
                <PageItems
                    queryClient={queryClient}
                    pageItems={pageData.page_items || []}
                    page_id={page_id}
                    parentCollectionId={parentCollectionId}
                />

                {showFieldPromt && (
                    <div className="fields-prompt-container">
                        {promtFields.map((field: fieldPromt) => (
                            <div key={field.id}>
                                <FieldsPromt
                                    field={field}
                                    queryClient={queryClient}
                                    page_id={page_id}
                                    handleFieldsCancel={handleFieldsCancel}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {showBlockPrompt && (
                    <div className="blocks-prompt-container">
                        {selectedBlocks.map((block) => (
                            <BlocksPropmts
                                key={block.instanceId || block.blockId}
                                block={block}
                                page_id={page_id}
                                queryClient={queryClient}
                                onCancel={() => handleBlockPromptCancel(block)}
                            />
                        ))}
                    </div>
                )}

                <AddPageItemsBtn
                    openFieldPopup={openFieldPopup}
                    openBlockPopup={openBlockPopup}
                />

                <FieldSelectionPopup
                    isOpen={isFieldPopupOpen}
                    onClose={closeFieldPopup}
                    onAddFields={handleAddSelectedFields}
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
