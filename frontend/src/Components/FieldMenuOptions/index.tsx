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
    Move,
    Copy,
    Eye,
    MoreHorizontal,
    Plus,
    AlignLeft,
} from "lucide-react";
import * as React from "react";
import "./index.scss";

export const FieldMenuOptions = ({
    nameInputRef,
    activeMenu,
    activeSubMenu,
    fieldName,
    handleNameSubmit,
    setActiveMenu,
    setActiveSubMenu,
    setFieldName,
    withContent,
    setWithContent,
    optionsRef,
    isSidebarOpen,
    handleEdit,
    handleDelete,
    handleAddConstraint,
    handleAddDescription,
    handleHide,
    availableConstraints,
    selectedConstraints,
    setSelectedConstraints,
}: any) => {
    const renderNameInputMenu = () => {
        const isMove = activeMenu === "move";
        const isCopy = activeMenu === "copy";
        const actionTitle = isMove
            ? activeSubMenu === "local"
                ? "Move to Collection Library"
                : "Move to Global Library"
            : activeSubMenu === "local"
              ? "Copy to Collection Library"
              : "Copy to Global Library";

        return (
            <div className="name-input-menu">
                <div className="name-input-header">
                    <div className="name-input-actions">
                        <div className="actions-title">{actionTitle}</div>
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
                                onClick={() => {
                                    setActiveSubMenu(null);
                                    if (!isMove && !isCopy) {
                                        setActiveMenu(null);
                                    }
                                }}
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
                {(isMove || isCopy) && (
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
                )}
            </div>
        );
    };

    const renderConstraintsList = () => {
        return (
            <div className="constraints-menu">
                <div className="constraints-header">
                    <div className="constraints-title">Add Constraints</div>
                    <button
                        className="cancel-button"
                        onClick={() => setActiveMenu(null)}
                    >
                        <X color={darkRed} size={16} />
                    </button>
                </div>
                <div className="constraints-list">
                    {availableConstraints.map((constraint) => (
                        <div
                            key={constraint.id}
                            className={`constraint-item ${selectedConstraints.includes(constraint.id) ? "selected" : ""}`}
                            onClick={() => handleAddConstraint(constraint.id)}
                        >
                            <span>{constraint.name}</span>
                            {selectedConstraints.includes(constraint.id) && (
                                <Check size={16} color={darkGreen} />
                            )}
                        </div>
                    ))}
                </div>
                <div className="apply-constraints">
                    <button
                        className="apply-button"
                        onClick={() => setActiveMenu(null)}
                    >
                        Apply
                    </button>
                </div>
            </div>
        );
    };

    const renderMoreOptions = () => {
        return (
            <div className="more-options-menu">
                <div className="option-item" onClick={handleAddDescription}>
                    <AlignLeft size={16} />
                    <span>Add Description</span>
                </div>
                <div className="option-item delete" onClick={handleDelete}>
                    <Trash2 size={16} />
                    <span>Delete</span>
                </div>
            </div>
        );
    };

    const renderSubMenu = () => {
        if (activeMenu === "move" || activeMenu === "copy") {
            return (
                <div className="sub-options-menu">
                    <div
                        className={`option-item ${activeSubMenu === "local" ? "active" : ""}`}
                        onClick={() => setActiveSubMenu("local")}
                    >
                        <Box size={16} />
                        <span>
                            {activeMenu.split("")[0].toUpperCase() +
                                activeMenu.split("").slice(1).join("")}{" "}
                            To Local
                        </span>
                    </div>
                    <div
                        className={`option-item ${activeSubMenu === "global" ? "active" : ""}`}
                        onClick={() => setActiveSubMenu("global")}
                    >
                        <Globe size={16} />
                        <span>
                            {activeMenu.split("")[0].toUpperCase() +
                                activeMenu.split("").slice(1).join("")}{" "}
                            To Global
                        </span>
                    </div>
                </div>
            );
        } else if (activeMenu === "constraints") {
            return renderConstraintsList();
        } else if (activeMenu === "more") {
            return renderMoreOptions();
        }
        return null;
    };

    return (
        <div ref={nameInputRef} className="menu-container">
            {/* Always render all three layers, conditionally showing them */}
            {activeSubMenu &&
                (activeMenu === "move" || activeMenu === "copy") && (
                    <div className="third-layer">{renderNameInputMenu()}</div>
                )}

            {activeMenu && (
                <div className="second-layer">{renderSubMenu()}</div>
            )}

            <div
                ref={optionsRef}
                className={`options-menu first-layer ${isSidebarOpen ? "sidebar-open" : ""}`}
            >
                <div className="option-item" onClick={handleEdit}>
                    <Pencil size={16} />
                    <span>Edit</span>
                </div>
                <div
                    className={`option-item ${activeMenu === "move" ? "active" : ""}`}
                    onClick={() =>
                        setActiveMenu(activeMenu === "move" ? null : "move")
                    }
                >
                    <Move size={16} />
                    <span>Move</span>
                </div>
                <div
                    className={`option-item ${activeMenu === "copy" ? "active" : ""}`}
                    onClick={() =>
                        setActiveMenu(activeMenu === "copy" ? null : "copy")
                    }
                >
                    <Copy size={16} />
                    <span>Copy</span>
                </div>
                <div
                    className={`option-item ${activeMenu === "constraints" ? "active" : ""}`}
                    onClick={() =>
                        setActiveMenu(
                            activeMenu === "constraints" ? null : "constraints",
                        )
                    }
                >
                    <Plus size={16} />
                    <span>Add Constraints</span>
                </div>
                <div className="option-item" onClick={handleHide}>
                    <Eye size={16} />
                    <span>Hide</span>
                </div>
                <div
                    className={`option-item ${activeMenu === "more" ? "active" : ""}`}
                    onClick={() =>
                        setActiveMenu(activeMenu === "more" ? null : "more")
                    }
                >
                    <MoreHorizontal size={16} />
                    <span>More</span>
                </div>
            </div>
        </div>
    );
};
