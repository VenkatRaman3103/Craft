import { useState, useRef, useEffect } from "react";
import { X, Plus, Layers } from "lucide-react";
import { lightFont } from "@/Styles/base";
import "./index.scss";
import * as React from "react";
import { BlocksIons } from "@/Data/blocksIcon";

type BlockOption = {
    id: string;
    name: string;
    type: string;
    description?: string;
    thumbnail?: string;
};

type SelectedBlock = {
    blockId: string;
    blockType: string;
};

interface BlockSelectionPopupProps {
    isOpen: boolean;
    onClose: () => void;
    availableBlocks: BlockOption[];
    onBlocksSelected: (selectedBlocks: SelectedBlock[]) => void;
}

export const BlockSelectionPopup: React.FC<BlockSelectionPopupProps> = ({
    isOpen,
    onClose,
    availableBlocks,
    onBlocksSelected,
}) => {
    const popupRef = useRef<HTMLDivElement>(null);
    const [selectedBlocksType, setSelectedBlocksType] = useState("all-blocks");
    const [localSelectedBlocks, setLocalSelectedBlocks] = useState<
        SelectedBlock[]
    >([]);
    const [searchTerm, setSearchTerm] = useState("");

    // Reset state when popup opens
    // useEffect(() => {
    //     if (isOpen) {
    //         setLocalSelectedBlocks([]);
    //         setSearchTerm("");
    //     }
    // }, [isOpen]);

    // Handle outside clicks to close the popup
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

    const toggleBlockSelection = (block: BlockOption) => {
        setLocalSelectedBlocks((prev) => {
            const isSelected = prev.some((item) => item.blockId === block.id);

            if (isSelected) {
                return prev.filter((item) => item.blockId !== block.id);
            } else {
                return [
                    ...prev,
                    {
                        blockId: block.id,
                        blockType: block.type,
                    },
                ];
            }
        });
    };

    const handleAddSelected = () => {
        onBlocksSelected(localSelectedBlocks);
        setLocalSelectedBlocks([]);
        onClose();
    };

    const handleCancel = () => {
        onClose();
    };

    const filteredBlocks = availableBlocks.filter((block) => {
        if (searchTerm) {
            return (
                block.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (block.description &&
                    block.description
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()))
            );
        }
        return true;
    });

    // Filter blocks by type if needed
    const displayedBlocks =
        selectedBlocksType === "all-blocks"
            ? filteredBlocks
            : filteredBlocks.filter((block) => {
                  // Add logic here to filter by custom or template blocks based on block properties
                  if (selectedBlocksType === "custom-blocks") {
                      // Example filter condition for custom blocks
                      return block.type.includes("custom");
                  } else if (selectedBlocksType === "template-blocks") {
                      // Example filter condition for template blocks
                      return block.type.includes("template");
                  }
                  return true;
              });

    const typeOfBlocks = [
        { label: "All Blocks", value: "all-blocks" },
        { label: "Custom Blocks", value: "custom-blocks" },
        { label: "Template Blocks", value: "template-blocks" },
    ];

    if (!isOpen) return null;

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
                            onClick={handleCancel}
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
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="blocks-grid">
                    {displayedBlocks.map((block) => (
                        <div
                            key={block.id}
                            className={`block-option ${
                                localSelectedBlocks.some(
                                    (item) => item.blockId === block.id,
                                )
                                    ? "selected"
                                    : ""
                            }`}
                            onClick={() => toggleBlockSelection(block)}
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
                        {localSelectedBlocks.length} block
                        {localSelectedBlocks.length !== 1 ? "s" : ""} selected
                    </div>
                    <div className="action-buttons">
                        <button
                            className="cancel-button"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                        <button
                            className="add-button"
                            onClick={handleAddSelected}
                            disabled={localSelectedBlocks.length === 0}
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
