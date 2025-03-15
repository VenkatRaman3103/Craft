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

type PageItemsType = {
    itemsList: any;
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
};

export const PageItems = ({
    itemsList,
    isSidebarOpen,
    onScopeChange,
    onAddFields,
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

    async function onDelete(block_id: string, item_id: string) {
        try {
            const response = await axios.delete(
                `${backendUrl}/block/${block_id}`,
            );
            console.log(response.data, "Deleted");
        } catch (error) {
            const errorMessage = {
                error,
                message: `Failed to delete block: ${block_id}`,
            };
            console.log(errorMessage);
        }

        // update the page items
        setPageItemsList((prevItems) =>
            prevItems.filter((item) => item.item_id !== item_id),
        );
    }

    console.log(pageItemsList, "pageItemsList");

    return (
        <div className="blocks-container">
            {pageItemsList?.map((item: any, index) => {
                if (item?.item_type === "block") {
                    if (item.block) {
                        return (
                            <Block
                                key={item.item_id || index}
                                block={item.block}
                                isSidebarOpen={isSidebarOpen}
                                onScopeChange={onScopeChange}
                                onDelete={onDelete}
                                onAddFields={onAddFields}
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
                        <p key={index}>Yet to be done</p>
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
    onAddFields,
    item_id,
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
    onDelete?: (block_id: string, item_id?: string) => void;
    onAddFields?: (blockId: string) => void;
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

    // Apply animations to fields container
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
            onDelete(block.block_id, item_id);
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
            </div>
        </div>
    );
};
