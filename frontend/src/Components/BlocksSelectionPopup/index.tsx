import { useState, useRef, useEffect } from "react";
import {
    X,
    Plus,
    Check,
    Layers,
    Cuboid,
    Parentheses,
    Brackets,
    CodeXml,
    Table,
    List,
    Link,
    CircleArrowOutDownLeft,
    CircleArrowOutUpRight,
    Upload,
    Heading1,
    SquareStack,
    Ampersand,
    UserRound,
    PenTool,
} from "lucide-react";
import { darkFont, lightFont } from "@/Styles/base";
import "./index.scss";
import * as React from "react";

const iconSize = 34;
const iconColor = darkFont;

const BlocksIons = {
    normal: <Cuboid size={iconSize} color={iconColor} />,
    array: <Brackets size={iconSize} color={iconColor} />,
    html: <CodeXml size={iconSize} color={iconColor} />,
    code: <Parentheses size={iconSize} color={iconColor} />,
    table: <Table size={iconSize} color={iconColor} />,
    list: <List size={iconSize} color={iconColor} />,
    link: <Link size={iconSize} color={iconColor} />,
    reference: <CircleArrowOutDownLeft size={iconSize} color={iconColor} />,
    dynamic: <CircleArrowOutUpRight size={iconSize} color={iconColor} />,
    upload: <Upload size={iconSize} color={iconColor} />,
    richtext: <Heading1 size={iconSize} color={iconColor} />,
    nested: <SquareStack size={iconSize} color={iconColor} />,
    conditional: <Ampersand size={iconSize} color={iconColor} />,
    user: <UserRound size={iconSize} color={iconColor} />,
    icon: <PenTool size={iconSize} color={iconColor} />,
};

type BlockOption = {
    id: string;
    name: string;
    type: string;
    description?: string;
    thumbnail?: string;
};

interface BlockSelectionPopupProps {
    isOpen: boolean;
    onClose: () => void;
    availableBlocks: BlockOption[];
    setShowBlockPrompt: React.Dispatch<React.SetStateAction<boolean>>;
    selectedBlocks: string[];
    setSelectedBlocks: React.Dispatch<React.SetStateAction<string[]>>;
}

export const BlockSelectionPopup: React.FC<BlockSelectionPopupProps> = ({
    isOpen,
    onClose,
    availableBlocks,
    setShowBlockPrompt,
    selectedBlocks,
    setSelectedBlocks,
}) => {
    const popupRef = useRef<HTMLDivElement>(null);
    const [selectedBlocksType, setSelectedBlocksType] = useState("all-blocks");

    // Close popup when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                popupRef.current &&
                !popupRef.current.contains(event.target as Node)
            ) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    const toggleBlockSelection = (block) => {
        setSelectedBlocks((prev) => {
            return prev.includes(block)
                ? prev.filter((id) => id !== block.id)
                : [...prev, block];
        });
        setShowBlockPrompt(false);
    };

    const handleAddSelected = () => {
        setShowBlockPrompt(true);
        setSelectedBlocks(selectedBlocks);
        onClose();
    };

    const typeOfBlocks = [
        { label: "All Blocks", value: "all-blocks" },
        { label: "Custom Blocks", value: "custom-blocks" },
        { label: "Template Blocks", value: "template-blocks" },
    ];

    if (!isOpen) return null;

    console.log(selectedBlocks, "selectedBlocks");

    return (
        <div className="block-selection-overlay">
            <div ref={popupRef} className="block-selection-popup">
                <div className="block-selection-content">
                    <div className="block-selection-header">
                        <div className="block-selection-heading-wrapper">
                            <div className="blocks-icon">
                                <Layers size={22} color="#fff" />
                            </div>
                            <h2>Add Blocks</h2>
                        </div>
                        <button
                            className="close-button"
                            onClick={onClose}
                            aria-label="Close"
                        >
                            <X size={22} color={lightFont} />
                        </button>
                    </div>

                    <div className="block-types">
                        <div className="block-types-wrapper">
                            {typeOfBlocks.map((type, ind) => (
                                <div
                                    key={ind}
                                    className={`type-btn ${selectedBlocksType === type.value ? "selected" : ""}`}
                                    onClick={() =>
                                        setSelectedBlocksType(type.value)
                                    }
                                >
                                    {type.label}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search blocks..."
                            className="search-input"
                        />
                    </div>
                </div>

                <div className="blocks-grid">
                    {availableBlocks.map((block) => (
                        <div
                            key={block.id}
                            className={`block-option ${
                                selectedBlocks.some((item) => {
                                    console.log(item, "itemBlock");
                                    return item.id === block.id;
                                })
                                    ? "selected"
                                    : ""
                            }`}
                            onClick={() => {
                                toggleBlockSelection(block);
                            }}
                        >
                            <div className="block-thumbnail">
                                {block.thumbnail ? (
                                    <img
                                        src={block.thumbnail}
                                        alt={block.name}
                                        className="thumbnail-image"
                                    />
                                ) : (
                                    <div className="thumbnail-placeholder">
                                        {BlocksIons[block.type]}
                                    </div>
                                )}
                            </div>
                            <div className="block-details">
                                <div className="block-name">{block.name}</div>
                                <div className="block-type">
                                    {block.description}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="block-selection-footer">
                    <div className="selection-count">
                        {selectedBlocks.length} block
                        {selectedBlocks.length !== 1 ? "s" : ""} selected
                    </div>
                    <div className="action-buttons">
                        <button className="cancel-button" onClick={onClose}>
                            Cancel
                        </button>
                        <button
                            className="add-button"
                            onClick={handleAddSelected}
                            disabled={selectedBlocks.length === 0}
                        >
                            <Plus size={16} />
                            Add Blocks
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
