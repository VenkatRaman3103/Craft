import { useState, useRef, useEffect } from "react";
import { Fields } from "../Fields/RenderFields";
import { blockType } from "@/Types/blocks";
import "./index.scss";
import { EllipsisVertical } from "lucide-react";
import { lightFont } from "@/Styles/base";
import * as React from "react";
import { BlockMenuOptions } from "../BlockMenuOptions";
import { backendUrl } from "@/config";
import axios from "axios";
import { FieldsList } from "../Fields/FieldsList";
import autoAnimate from "@formkit/auto-animate";
import { FieldWrapper } from "../Fields/FieldWrapper";
import { FieldsBlocksRenderer } from "../FieldsBlocksRenderer";
import { useFieldsBlocks } from "@/hooks/useFieldsBlocks";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AddTemplate } from "../Buttons/AddTemplate";
import { NormalBlock } from "./NormalBlocks";
import { ArrayBlock } from "./ArrayBlock";
import { TableBlock } from "./TableBlocks";
import { ReferenceBlocks } from "./ReferenceBlocks";
import { ApiBlock } from "./ApiBlocks";

type PageItemsType = {
    itemsList: any;
    itemType: string;
    isSidebarOpen?: boolean;
    onScopeChange?: (
        blockId: string,
        name: string,
        isGlobal: boolean,
        withContent: boolean,
    ) => void;
    onAddFields?: (blockId: string) => void;
    queryClient: any;
    query_key_id: string | undefined;
    parentCollectionId: any;
    queryKey: [string, string | undefined];
    localFields: any[];
};

export const PageItems = ({
    itemsList,
    isSidebarOpen,
    onScopeChange,
    onAddFields,
    localFields,
    queryClient,
    query_key_id,
    itemType,
    parentCollectionId,
    queryKey,
}: PageItemsType) => {
    const [pageItemsList, setPageItemsList] = useState<blockType[]>(itemsList);

    useEffect(() => {
        setPageItemsList(itemsList);
    }, [itemsList]);

    const blocksMutation = useMutation({
        mutationFn: async ({
            block_id,
            item_id,
            block,
        }: {
            block_id: string;
            item_id: string;
            block: any;
        }) => {
            console.log(block, itemType, item_id, "onDelete"); // Should now log the correct value

            const responseBlock = await axios.delete(
                `${backendUrl}/${block.block_type}/${block_id}`,
            );

            console.log(responseBlock, item_id, "responseDelete");

            if (itemType === "block" && item_id) {
                const blockItemsResponse = await axios.delete(
                    `${backendUrl}/${itemType}/block_items/${item_id}`,
                );
            } else if (itemType === "array" && item_id) {
                const response = await axios.delete(
                    `${backendUrl}/${itemType}/block_items/${item_id}`,
                );
            }
            return responseBlock;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKey });
        },
        onError: (error: any) => {
            console.error("Failed to delete block:", error);
        },
    });

    async function onDelete(block_id: string, item_id: string, block: any) {
        blocksMutation.mutate({ block_id, item_id, block });
    }

    console.log(itemsList, "itemsListPageItems");

    return (
        <div className="blocks-container prior-drop">
            {pageItemsList?.map((item: any, index) => {
                console.log(item, item[item.item_type], "pageItemsList");
                if (
                    item?.item_type === "block" ||
                    item?.item_type === "array" ||
                    item?.item_type === "table" ||
                    item?.item_type === "reference" ||
                    item?.item_type === "normal" ||
                    item?.item_type === "api"
                ) {
                    if (item[item.item_type]) {
                        return (
                            <Block
                                key={item.item_id || index}
                                block={item[item.item_type]}
                                isSidebarOpen={isSidebarOpen}
                                onScopeChange={onScopeChange}
                                onDelete={onDelete}
                                localFields={localFields}
                                onAddFields={onAddFields}
                                queryClient={queryClient}
                                item_id={item.item_id}
                            />
                        );
                    }
                } else {
                    const Field = FieldsList[item?.item_type];

                    return item[item.item_type] ? (
                        <FieldWrapper
                            key={item.item_id || index}
                            data={item[item.item_type]}
                            queryClient={queryClient}
                            query_key_id={query_key_id}
                            queryKey={queryKey}
                            parentCollectionId={parentCollectionId}
                            itemType={itemType}
                        >
                            <Field data={item[item.item_type]} />
                        </FieldWrapper>
                    ) : (
                        <p key={index}>Noting in here</p>
                    );
                }
            })}
        </div>
    );
};

export const Block = ({
    block,
    isSidebarOpen,
    onScopeChange,
    onDelete,
    queryClient,
    onAddFields,
    itemType,
    item_id,
    localFields,
}: {
    block: blockType;
    isSidebarOpen?: boolean;
    onScopeChange?: (
        blockId: string,
        name: string,
        isGlobal: boolean,
        withContent: boolean,
    ) => void;
    item_id?: string;
    onDelete?: (block_id: string, item_id: string) => void;
    onAddFields?: (blockId: string) => void;
    queryClient?: any;
}) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [activeScopeOption, setActiveScopeOption] = useState();
    const [blockName, setBlockName] = useState("");
    const [withContent, setWithContent] = useState(true);

    const optionsRef = useRef<HTMLDivElement>(null);
    const nameInputRef = useRef<HTMLDivElement>(null);
    const ellipsisRef = useRef<HTMLDivElement>(null);
    const fieldsContainerRef = useRef<HTMLDivElement>(null);
    const [fields, setFields] = useState([]);

    const { data: blockItemsList } = useQuery({
        queryKey: ["blockItems", block.block_id],
        queryFn: async function fetchBlockItems() {
            const response = await axios.get(
                `${backendUrl}/${block.block_type}/${parentBlockId}`,
            );

            console.log(response, "templateResponse");

            return response.data;
        },
    });
    const [parentBlockId, setParentBlockId] = useState(block.block_id);

    const fieldsBlocksProps = useFieldsBlocks({
        itemType,
    });

    useEffect(() => {
        if (fieldsContainerRef.current) {
            autoAnimate(fieldsContainerRef.current);
        }
    }, [fieldsContainerRef]);

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    const toggleOptions = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowOptions(!showOptions);
        setActiveScopeOption(null);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (
            optionsRef.current &&
            !optionsRef.current.contains(event.target as Node) &&
            nameInputRef.current &&
            !nameInputRef.current.contains(event.target as Node) &&
            ellipsisRef.current &&
            !ellipsisRef.current.contains(event.target as Node)
        ) {
            setShowOptions(false);
            setActiveScopeOption(null);
        }
    };

    const handleScopeOptionClick = (
        e: React.MouseEvent,
        type: "local" | "shared",
    ) => {
        e.stopPropagation();
        setActiveScopeOption(type);
    };

    const handleDelete = () => {
        if (onDelete) {
            onDelete(block.block_id, item_id, block);
        }
        setShowOptions(false);
    };

    const handleNameSubmit = () => {
        if (onScopeChange && blockName.trim() && activeScopeOption) {
            onScopeChange(
                block.id,
                blockName,
                activeScopeOption === "shared",
                withContent,
            );
            setShowOptions(false);
            setActiveScopeOption(null);
            setBlockName("");
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        setFields(block.fields);
    }, [block]);

    console.log(
        blockItemsList ? blockItemsList?.block_items : null,
        "blockItemsList",
    );

    function renderBlock(blockType) {
        console.log(blockType, "blockType");
        switch (blockType) {
            case "normal":
                return (
                    <NormalBlock
                        blockItemsList={
                            blockItemsList ? blockItemsList.block_items : null
                        }
                        block={block}
                        queryClient={queryClient}
                        localFields={localFields}
                        fieldsBlocksProps={fieldsBlocksProps}
                    />
                );
            case "array":
                return (
                    <ArrayBlock
                        blockItemsList={blockItemsList ? blockItemsList : []}
                        block={block}
                        queryClient={queryClient}
                        localFields={localFields}
                        fieldsBlocksProps={fieldsBlocksProps}
                    />
                );
            case "table":
                return <TableBlock block={block} />;
            case "reference":
                return <ReferenceBlocks block={block} />;
            case "api":
                return <ApiBlock block={block} />;
            default:
                return <h1>New block has to be added</h1>;
        }
    }

    console.log(block.block_type, "block_type<---");

    return (
        <div className="block-container">
            <div className="block-wrapper">
                <div
                    className={`block-header-container ${isCollapsed ? "collapsed" : ""}`}
                    onClick={toggleCollapse}
                >
                    <div className="block-header-wrapper">
                        <div className="block-type">{block?.name}</div>
                        <div
                            ref={ellipsisRef}
                            className="ellipsis-container"
                            onClick={toggleOptions}
                        >
                            <EllipsisVertical size={20} color={lightFont} />
                        </div>
                    </div>
                </div>

                {showOptions && (
                    <BlockMenuOptions
                        nameInputRef={nameInputRef}
                        activeScopeOption={activeScopeOption}
                        blockName={blockName}
                        handleNameSubmit={handleNameSubmit}
                        setActiveScopeOption={setActiveScopeOption}
                        setBlockName={setBlockName}
                        withContent={withContent}
                        setWithContent={setWithContent}
                        optionsRef={optionsRef}
                        isSidebarOpen={isSidebarOpen}
                        handleScopeOptionClick={handleScopeOptionClick}
                        handleDelete={handleDelete}
                    />
                )}

                <div
                    className={`fields-container ${isCollapsed ? "collapsed" : ""}`}
                    ref={fieldsContainerRef}
                >
                    <Fields fields={block.fields} />
                </div>

                {renderBlock(block.block_type)}
            </div>
        </div>
    );
};
