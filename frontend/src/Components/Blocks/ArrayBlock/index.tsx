import { createArrayBlockTemplate } from "@/api/createBlock";
import { AddTemplate } from "@/Components/Buttons/AddTemplate";
import { FieldsBlocksRenderer } from "@/Components/FieldsBlocksRenderer";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export const ArrayBlock = ({
    blockItemsList,
    block,
    queryClient,
    localFields,
    fieldsBlocksProps,
}: any) => {
    const [activeTemplateId, setActiveTemplateId] = useState<
        string | undefined
    >(undefined);

    const modifiedOpenBlockPopup = (templateId?: string) => {
        setActiveTemplateId(templateId);
        fieldsBlocksProps.openBlockPopup();
    };

    const modifiedProps = {
        ...fieldsBlocksProps,
        openBlockPopup: modifiedOpenBlockPopup,
        activeTemplateId: activeTemplateId,
        setActiveTemplateId: setActiveTemplateId,
    };

    const arrayBlockMutation = useMutation({
        mutationFn: async ({ parentBlockId }: { parentBlockId: string }) => {
            createArrayBlockTemplate(parentBlockId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["blockItems", block.block_id]);
        },
    });

    if (!blockItemsList) {
        return <div>Loading...</div>;
    }

    function createTemplate(parentBlockId: string) {
        arrayBlockMutation.mutate({ parentBlockId });
    }

    console.log(fieldsBlocksProps.selectedBlocks, "blockItemsListArray");

    return (
        <>
            {blockItemsList.map((template, index) => (
                <FieldsBlocksRenderer
                    itemsList={template.templateItems}
                    query_key_id={""}
                    parentCollectionId={null}
                    itemType={"array"}
                    parentBlockId={block.block_id}
                    parentBlockType={block.block_type}
                    queryKey={["blockItems", block.block_id]}
                    queryClient={queryClient}
                    localFields={localFields}
                    {...modifiedProps}
                    key={index}
                    templateId={template.templateId}
                />
            ))}
            <div
                className="add-template-btn"
                onClick={() => createTemplate(block.block_id)}
            >
                <AddTemplate
                    iconLable={`${blockItemsList.length > 1 ? "Duplicate the Template" : "Create a New Template"}`}
                />
            </div>
        </>
    );
};
