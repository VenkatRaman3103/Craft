import { useState, useRef, useEffect } from "react";
import { Fields } from "../Fields/RenderFields";
import { blockType } from "@/Types/blocks";
import "./index.scss";
import {
    EllipsisVertical,
    Globe,
    Box,
    Trash2,
    Check,
    Circle,
    File,
    FileText,
    X,
} from "lucide-react";
import { darkGreen, darkRed, lightFont } from "@/Styles/base";

export const Blocks = ({
    blocks,
    isSidebarOpen,
    onScopeChange,
    onDelete,
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
}) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [activeScopeOption, setActiveScopeOption] = useState<
        "local" | "shared" | null
    >(null);
    const [blockName, setBlockName] = useState("");
    const [withContent, setWithContent] = useState(true);

    const optionsRef = useRef<HTMLDivElement>(null);
    const nameInputRef = useRef<HTMLDivElement>(null);
    const ellipsisRef = useRef<HTMLDivElement>(null);

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

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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
                    <div ref={nameInputRef} className="menu-container">
                        {activeScopeOption && (
                            <div className="name-input-menu">
                                <div className="name-input-header">
                                    <div className="name-input-actions">
                                        <div className="actions-title">
                                            {activeScopeOption === "local"
                                                ? "Create Local Block"
                                                : "Add to Component Library"}
                                        </div>
                                        <div className="actions">
                                            <button
                                                className={`save-button ${!blockName.trim() ? "disabled" : ""}`}
                                                onClick={handleNameSubmit}
                                                disabled={!blockName.trim()}
                                            >
                                                <Check
                                                    color={darkGreen}
                                                    size={16}
                                                />
                                            </button>
                                            <button
                                                className="cancel-button"
                                                onClick={() =>
                                                    setActiveScopeOption(null)
                                                }
                                            >
                                                <X color={darkRed} size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="name-input-field">
                                    <input
                                        type="text"
                                        value={blockName}
                                        onChange={(e) =>
                                            setBlockName(e.target.value)
                                        }
                                        placeholder="Enter component name"
                                        autoFocus
                                    />
                                </div>
                                <div className="content-option">
                                    <div
                                        className={`option-toggle ${withContent ? "active" : ""}`}
                                        onClick={() => setWithContent(true)}
                                    >
                                        <FileText color={lightFont} size={16} />
                                        <span>With content</span>
                                    </div>
                                    <div
                                        className={`option-toggle ${!withContent ? "active" : ""}`}
                                        onClick={() => setWithContent(false)}
                                    >
                                        <File color={lightFont} size={16} />
                                        <span>Structure only</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div
                            ref={optionsRef}
                            className={`options-menu ${isSidebarOpen ? "sidebar-open" : ""}`}
                        >
                            <div
                                className={`option-item ${activeScopeOption === "local" ? "active" : ""}`}
                                onClick={(e) =>
                                    handleScopeOptionClick(e, "local")
                                }
                            >
                                <Box size={16} />
                                <span>Convert to Local Block</span>
                            </div>
                            <div
                                className={`option-item ${activeScopeOption === "shared" ? "active" : ""}`}
                                onClick={(e) =>
                                    handleScopeOptionClick(e, "shared")
                                }
                            >
                                <Globe size={16} />
                                <span>Add to Component Library</span>
                            </div>
                            <div
                                className="option-item delete"
                                onClick={handleDelete}
                            >
                                <Trash2 size={16} />
                                <span>Delete</span>
                            </div>
                        </div>
                    </div>
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
