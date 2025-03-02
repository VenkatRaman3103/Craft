import { darkGreen, darkRed, lightFont } from "@/Styles/base";
import { Box, Check, File, FileText, Globe, Trash2, X } from "lucide-react";

export const BlockMenuOptions = ({
    nameInputRef,
    activeScopeOption,
    blockName,
    handleNameSubmit,
    setActiveScopeOption,
    setBlockName,
    withContent,
    setWithContent,
    optionsRef,
    isSidebarOpen,
    handleScopeOptionClick,
    handleDelete,
}: any) => {
    return (
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
                                    <Check color={darkGreen} size={16} />
                                </button>
                                <button
                                    className="cancel-button"
                                    onClick={() => setActiveScopeOption(null)}
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
                            onChange={(e) => setBlockName(e.target.value)}
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
                    onClick={(e) => handleScopeOptionClick(e, "local")}
                >
                    <Box size={16} />
                    <span>Convert to Local Block</span>
                </div>
                <div
                    className={`option-item ${activeScopeOption === "shared" ? "active" : ""}`}
                    onClick={(e) => handleScopeOptionClick(e, "shared")}
                >
                    <Globe size={16} />
                    <span>Add to Component Library</span>
                </div>
                <div className="option-item delete" onClick={handleDelete}>
                    <Trash2 size={16} />
                    <span>Delete</span>
                </div>
            </div>
        </div>
    );
};
