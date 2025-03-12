import { darkGreen, darkRed, lightFont } from "@/Styles/base";
import {
    Check,
    File,
    FileText,
    Globe,
    Trash2,
    X,
    Box,
    Pencil,
} from "lucide-react";
import * as React from "react";
import "./index.scss";

export const FieldMenuOptions = ({
    nameInputRef,
    activeScopeOption,
    fieldName,
    handleNameSubmit,
    setActiveScopeOption,
    setFieldName,
    withContent,
    setWithContent,
    optionsRef,
    isSidebarOpen,
    handleScopeOptionClick,
    handleDelete,
    handleEdit,
}: any) => {
    return (
        <div ref={nameInputRef} className="menu-container">
            {activeScopeOption && (
                <div className="name-input-menu">
                    <div className="name-input-header">
                        <div className="name-input-actions">
                            <div className="actions-title">
                                {activeScopeOption === "local"
                                    ? "Create Local Field"
                                    : "Add to Field Library"}
                            </div>
                            <div className="actions">
                                <button
                                    className={`save-button ${!fieldName.trim() ? "disabled" : ""}`}
                                    onClick={handleNameSubmit}
                                    disabled={!fieldName.trim()}
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
                            value={fieldName}
                            onChange={(e) => setFieldName(e.target.value)}
                            placeholder="Enter field name"
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
                <div className={`option-item `} onClick={handleEdit}>
                    {/* <Box size={16} /> */}
                    <Pencil size={16} />
                    <span>Edit</span>
                </div>
                <div
                    className={`option-item ${activeScopeOption === "local" ? "active" : ""}`}
                    onClick={(e) => handleScopeOptionClick(e, "local")}
                >
                    <Box size={16} />
                    <span>Convert to Local Field</span>
                </div>
                <div
                    className={`option-item ${activeScopeOption === "shared" ? "active" : ""}`}
                    onClick={(e) => handleScopeOptionClick(e, "shared")}
                >
                    <Globe size={16} />
                    <span>Add to Field Library</span>
                </div>
                <div className="option-item delete" onClick={handleDelete}>
                    <Trash2 size={16} />
                    <span>Delete</span>
                </div>
            </div>
        </div>
    );
};
