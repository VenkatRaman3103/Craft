import { useEffect, useState } from "react";
import { sampleFields } from "@/Data/fields";

interface UseFieldsBlocksProps {
    itemType: string;
}

export const useFieldsBlocks = ({ itemType }: UseFieldsBlocksProps) => {
    // Field states
    const [showFieldPromt, setShowFieldPromt] = useState(false);
    const [isFieldPopupOpen, setIsFieldPopupOpen] = useState(false);
    const [promtFields, setPromtFields] = useState<any[]>([]);
    const [fieldType, setFieldType] = useState(itemType);

    // Block states
    const [showBlockPrompt, setShowBlockPrompt] = useState(false);
    const [isBlockPopupOpen, setIsBlockPopupOpen] = useState(false);
    const [selectedBlocks, setSelectedBlocks] = useState<any[]>([]);

    // Field popup handlers
    const openFieldPopup = () => setIsFieldPopupOpen(true);
    const closeFieldPopup = () => setIsFieldPopupOpen(false);

    // Block popup handlers
    const openBlockPopup = () => setIsBlockPopupOpen(true);
    const closeBlockPopup = () => setIsBlockPopupOpen(false);

    // Field selection handler
    const handleAddSelectedFields = (
        selectedFieldIds: any[],
        selectedFieldsType: string,
        localFields: any[] = [],
    ) => {
        console.log(selectedFieldsType, "localfieldssome");

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
            console.log(localFields, "fieldsToAdd");

            const fieldsToAdd = localFields
                .filter((field: any) =>
                    selectedFieldIds.includes(field[field.item_type].field_id),
                )
                .map((field: any) => field[field.item_type]);

            setPromtFields([...promtFields, ...fieldsToAdd]);
        }

        if (selectedFieldIds.length > 0) {
            setShowFieldPromt(true);
        }
    };

    // Field cancellation handler
    const handleFieldsCancel = (promtField: any) => {
        setPromtFields((prev: any[]) =>
            prev.filter((field) => field.field_id !== promtField.field_id),
        );

        if (promtFields.length <= 1) {
            setShowFieldPromt(false);
        }
    };

    // Block selection handler
    const handleBlocksSelected = (newSelectedBlocks: any[]) => {
        setSelectedBlocks((prev: any[]) => [...prev, ...newSelectedBlocks]);

        if (newSelectedBlocks.length > 0) {
            setShowBlockPrompt(true);
        }
    };

    // Block cancellation handler
    const handleBlockPromptCancel = (block: any) => {
        setSelectedBlocks((prev: any[]) =>
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

    return {
        // Field states and handlers
        showFieldPromt,
        promtFields,
        isFieldPopupOpen,
        fieldType,
        openFieldPopup,
        closeFieldPopup,
        handleAddSelectedFields,
        handleFieldsCancel,

        // Block states and handlers
        showBlockPrompt,
        selectedBlocks,
        isBlockPopupOpen,
        openBlockPopup,
        closeBlockPopup,
        handleBlocksSelected,
        handleBlockPromptCancel,
    };
};
