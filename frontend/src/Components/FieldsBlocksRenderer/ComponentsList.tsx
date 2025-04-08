import { sampleFields } from "@/Data/fields";
import { PageItems } from "../Blocks";
import { BlocksPropmts } from "../BlocksPromts";
import { BlockSelectionPopup } from "../BlocksSelectionPopup";
import { AddPageItemsBtn } from "../FieldsAndBlocksList";
import { FieldSelectionPopup } from "../FieldSelectionPopup";
import { FieldsPromt } from "../FieldsPromt";
import { sampleBlocks } from "@/Data/blocks";

// Defining proper props interface for ComponentsList
interface ComponentsListProps {
    queryClient: QueryClient;
    itemsList: any[];
    query_key_id: string | undefined;
    parentCollectionId: string | null;
    parentBlockType: string | undefined;
    localFields: any[];
    queryKey: [string, string | undefined];
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
    itemType: string;
    parentBlockId?: string;
}

export const ComponentsList = ({
    queryClient,
    itemsList,
    query_key_id,
    parentCollectionId,
    parentBlockType,
    localFields,
    queryKey,
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
    itemType,
    parentBlockId,
}: ComponentsListProps) => {
    return (
        <div>
            <PageItems
                queryClient={queryClient}
                itemsList={itemsList}
                query_key_id={query_key_id}
                parentCollectionId={parentCollectionId}
                itemType={parentBlockType}
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
                                itemType={parentBlockType}
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
                            parentBlockType={parentBlockType}
                            page_id={query_key_id || ""}
                            itemType={itemType}
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
                isVerbose={true}
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
