import { FieldsBlocksRenderer } from "@/Components/FieldsBlocksRenderer";

export const NormalBlock = ({
    blockItemsList,
    block,
    queryClient,
    localFields,
    fieldsBlocksProps,
}: any) => {
    return (
        <>
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
            />
        </>
    );
};
