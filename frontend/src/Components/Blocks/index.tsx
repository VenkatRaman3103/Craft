import { useState, useRef, useEffect } from "react";
import { Fields } from "../Fields/RenderFields";
import { blockType } from "@/Types/blocks";
import "./index.scss";
import {
    AtSign,
    Braces,
    CalendarDays,
    CaseSensitive,
    CircleCheck,
    Divide,
    EllipsisVertical,
    Image,
    LetterText,
    Link,
    SquareCheck,
    Type,
} from "lucide-react";
import { darkGreen, darkRed, lightFont } from "@/Styles/base";
import * as React from "react";
import { BlockMenuOptions } from "../BlockMenuOptions";
import { AddBtn } from "../Buttons/AddBtn";
import { FieldSelectionPopup } from "../FieldSelectionPopup";
import { backendUrl } from "@/config";
import axios from "axios";
import { FieldsList } from "../Fields/FieldsList";

export const FieldsIcons = {
    text: <Type size={20} color={lightFont} />,
    number: <Divide size={20} color={lightFont} />,
    json: <Braces size={20} color={lightFont} />,
    "multi-select": <SquareCheck size={20} color={lightFont} />,
    "rich-text": <LetterText size={20} color={lightFont} />,
    select: <CircleCheck size={20} color={lightFont} />,
    date: <CalendarDays size={20} color={lightFont} />,
    email: <AtSign size={20} color={lightFont} />,
    upload: <Image size={20} color={lightFont} />,
    relation: <Link size={20} color={lightFont} />,
};

// Sample field options (replace with your actual data source)

export const PageItems = ({
    pageItems,
    isSidebarOpen,
    onScopeChange,
    onAddFields,
}: {
    pageItems: blockType[];
    isSidebarOpen?: boolean;
    onScopeChange?: (
        blockId: string,
        name: string,
        isGlobal: boolean,
        withContent: boolean,
    ) => void;
    onAddFields?: (blockId: string) => void;
}) => {
    const [pageItemsList, setPageItemsList] = useState<blockType[]>(pageItems);

    useEffect(() => {
        setPageItemsList(pageItems);
    }, [pageItems]);

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

    console.log(pageItemsList, "pageItems");

    return (
        <div className="blocks-container">
            {pageItemsList.map((item, index) => {
                if (item?.item_type === "block") {
                    if (item.block) {
                        return (
                            <Block
                                key={index}
                                block={item.block}
                                isSidebarOpen={isSidebarOpen}
                                onScopeChange={onScopeChange}
                                onDelete={onDelete}
                                onAddFields={onAddFields}
                                item_id={item.item_id}
                            />
                        );
                    }
                } else if (item?.item_type === "field") {
                    const Field = FieldsList[item.field.type];
                    return <Field key={index} data={item.field} />;
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
    onDelete?: (block_id: string) => void;
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
    const [fields, setFields] = useState([]);

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

    console.log(block, "blockForPage");

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
                >
                    <Fields fields={block.fields} />
                </div>
            </div>
        </div>
    );
};
