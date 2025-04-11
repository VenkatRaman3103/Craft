import { createArrayBlockTemplate } from "@/api/createBlock";
import { AddTemplate } from "@/Components/Buttons/AddTemplate";
import { FieldsBlocksRenderer } from "@/Components/FieldsBlocksRenderer";
import { useMutation } from "@tanstack/react-query";

export const ArrayBlock = ({
    blockItemsList,
    block,
    queryClient,
    localFields,
    fieldsBlocksProps,
}: any) => {
    const arrayBlockMutation = useMutation({
        mutationFn: async ({ parentBlockId }: { parentBlockId: string }) => {
            createArrayBlockTemplate(parentBlockId);
        },

        onSuccess: () => {
            queryClient.invalidateQueries(["blockItems", block.block_id]);
        },
    });

    if (!blockItemsList) {
        return <div>Some</div>;
    }

    function createTemplate(parentBlockId: string) {
        arrayBlockMutation.mutate({ parentBlockId });
    }

    console.log(blockItemsList, "blockItemsListArray");

    return (
        <>
            {blockItemsList.map((template, index) => (
                <FieldsBlocksRenderer
                    itemsList={template.block_items}
                    query_key_id={""}
                    parentCollectionId={null}
                    itemType={"block"}
                    parentBlockId={block.block_id}
                    parentBlockType={block.block_type}
                    queryKey={["blockItems", block.block_id]}
                    queryClient={queryClient}
                    localFields={localFields}
                    {...fieldsBlocksProps}
                    key={index}
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
