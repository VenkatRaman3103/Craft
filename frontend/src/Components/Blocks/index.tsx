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
const sampleFields = [
    {
        id: "field1",
        name: "Text Field",
        type: "text",
    },
    {
        id: "field2",
        name: "Number Field",
        type: "number",
    },
    {
        id: "field3",
        name: "Json Field",
        type: "json",
    },
    {
        id: "field4",
        name: "Multi Select Field",
        type: "multi-select",
    },
    {
        id: "field5",
        name: "Select Field",
        type: "select",
    },
    {
        id: "field6",
        name: "Rich Text Field",
        type: "rich-text",
    },
    {
        id: "field7",
        name: "Date Field",
        type: "date",
    },
    {
        id: "field8",
        name: "Emain Field",
        type: "email",
    },
    {
        id: "field9",
        name: "Upload Field",
        type: "upload",
    },
    {
        id: "field10",
        name: "Relation Field",
        type: "relation",
    },
];

export const Blocks = ({
    blocks,
    isSidebarOpen,
    onScopeChange,
    onDelete,
    onAddFields, // Add this prop to pass from parent
}: {
    blocks: blockType[];
    isSidebarOpen?: boolean;
    onScopeChange?: (
        blockId: string,
        name: string,
        isGlobal: boolean,
        withContent: boolean,
    ) => void;
    onDelete?: (blockId: string) => void;
    onAddFields?: (blockId: string) => void; // Add this prop type
}) => {
    return (
        <div className="blocks-container">
            {blocks.map((item, index) => (
                <Block
                    key={index}
                    block={item}
                    isSidebarOpen={isSidebarOpen}
                    onScopeChange={onScopeChange}
                    onDelete={onDelete}
                    onAddFields={onAddFields}
                />
            ))}
        </div>
    );
};

export const Block = ({
    block,
    isSidebarOpen,
    onScopeChange,
    onDelete,
    onAddFields,
}: {
    block: blockType;
    isSidebarOpen?: boolean;
    onScopeChange?: (
        blockId: string,
        name: string,
        isGlobal: boolean,
        withContent: boolean,
    ) => void;
    onDelete?: (blockId: string) => void;
    onAddFields?: (blockId: string) => void;
}) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [activeScopeOption, setActiveScopeOption] = useState();
    const [blockName, setBlockName] = useState("");
    const [withContent, setWithContent] = useState(true);
    const [isFieldPopupOpen, setIsFieldPopupOpen] = useState(false);

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
            onDelete(block.id);
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

    // Method to open the field selection popup
    const openFieldPopup = () => {
        setIsFieldPopupOpen(true);
    };

    // Method to close the field selection popup
    const closeFieldPopup = () => {
        setIsFieldPopupOpen(false);
    };

    // Method to handle adding fields to this specific block
    const handleAddSelectedFields = (selectedFieldIds: string[]) => {
        // Get the selected field objects
        const fieldsToAdd = sampleFields
            .filter((field) => selectedFieldIds.includes(field.id))
            .map((field) => ({
                id: `${field.id}-${Date.now()}`,
                name: field.name,
                type: field.type,
                // Add any other properties needed for your fields
            }));

        // Update the local fields state
        setFields([...fields, ...fieldsToAdd]);
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
                        <div className="block-type">{block.type}</div>
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
                <div onClick={openFieldPopup}>
                    <AddBtn iconLable="Add Field" />
                </div>
            </div>

            {/* Field Selection Popup */}
            <FieldSelectionPopup
                isOpen={isFieldPopupOpen}
                onClose={closeFieldPopup}
                onAddFields={handleAddSelectedFields}
                availableFields={sampleFields}
            />
        </div>
    );
};
