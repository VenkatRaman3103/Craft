import { AddTemplate } from "@/Components/Buttons/AddTemplate";
import { FieldsBlocksRenderer } from "@/Components/FieldsBlocksRenderer";

export const ArrayBlock = ({
    blockItemsList,
    block,
    queryClient,
    localFields,
    fieldsBlocksProps,
}: any) => {
    if (!blockItemsList) {
        return <div>Some</div>;
    }

    console.log(blockItemsList, "blockItemsListArray");

    return (
        <>
            {blockItemsList.map((template, index) => (
                <FieldsBlocksRenderer
                    itemsList={blockItemsList}
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

            <div className="add-template-btn">
                <AddTemplate
                    iconLable={`${blockItemsList.length > 1 ? "Duplicate the Template" : "Create a New Template"}`}
                />
            </div>
        </>
    );
};
