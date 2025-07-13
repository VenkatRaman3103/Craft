import React, { useState, useRef, useEffect } from "react";
import "./index.scss";

import {
    updateAlignType,
    updateAlignItems,
    updateIsReveresed,
    updateFlexDirection,
    updateJustifyContent,
    updateGap,
} from "@/store/toolbar/alignmentControl/alignmentControl";

import {
    AlignCenterHorizontal,
    AlignCenterVertical,
    AlignEndHorizontal,
    AlignEndVertical,
    AlignHorizontalSpaceAround,
    AlignHorizontalSpaceBetween,
    AlignStartHorizontal,
    AlignStartVertical,
    AlignVerticalJustifyCenter,
    ArrowLeft,
    ArrowUp,
    Ungroup,
} from "lucide-react";
import { StoreState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";

export const AlignmentControlPanel = ({
    selectedId,
    elements,
    setElements,
    updateElementMutation,
    deleteElementMutation,
}: {
    selectedId: number | string | null;
    elements: any[];
    setElements: React.Dispatch<React.SetStateAction<any[]>>;
    updateElementMutation?: any;
    deleteElementMutation?: any;
}) => {
    const {
        type: globalType,
        flexDirection: globalFlexDirection,
        isReveresed: globalIsReversed,
        alignItems: globalAlignItems,
        justifyContent: globalJustifyContent,
        gap: globalGap,
    } = useSelector((state: StoreState) => state.alignmentControl);

    const dispatch = useDispatch();

    const selectedElement = selectedId
        ? elements.find((el) => el.id === selectedId)
        : null;

    const isGroupSelected = selectedElement?.isGroup || false;

    // Get current values (group takes precedence over global)
    const type = isGroupSelected
        ? selectedElement?.displayType || "flex"
        : globalType;
    const flexDirection = isGroupSelected
        ? selectedElement?.flexDirection || "row"
        : globalFlexDirection;
    const isReveresed = isGroupSelected
        ? selectedElement?.isReversed || false
        : globalIsReversed;
    const alignItems = isGroupSelected
        ? selectedElement?.alignItems || "flex-start"
        : globalAlignItems;
    const justifyContent = isGroupSelected
        ? selectedElement?.justifyContent || "flex-start"
        : globalJustifyContent;
    const gap = isGroupSelected ? selectedElement?.gap || 0 : globalGap;

    const getComputedFlexDirection = (direction: string, reversed: boolean) => {
        if (direction === "row") {
            return reversed ? "row-reverse" : "row";
        } else {
            return reversed ? "column-reverse" : "column";
        }
    };

    const getFlexDirection = () => {
        return getComputedFlexDirection(flexDirection, isReveresed);
    };

    // Enhanced update function that persists changes
    const updateElementProperty = async (property: string, value: any) => {
        if (isGroupSelected && selectedId) {
            // Update local state immediately for responsive UI
            setElements((prev) =>
                prev.map((el) =>
                    el.id === selectedId ? { ...el, [property]: value } : el,
                ),
            );

            // Persist to backend if mutation is available
            if (updateElementMutation) {
                try {
                    const updatedElement = {
                        ...selectedElement,
                        [property]: value,
                    };

                    // Calculate computed flex direction for styles
                    const computedFlexDirection =
                        property === "flexDirection" ||
                        property === "isReversed"
                            ? getComputedFlexDirection(
                                  property === "flexDirection"
                                      ? value
                                      : updatedElement.flexDirection || "row",
                                  property === "isReversed"
                                      ? value
                                      : updatedElement.isReversed || false,
                              )
                            : getComputedFlexDirection(
                                  updatedElement.flexDirection || "row",
                                  updatedElement.isReversed || false,
                              );

                    // Update styles based on alignment properties
                    const updatedStyles = {
                        ...selectedElement.styles,
                        display:
                            property === "displayType"
                                ? value
                                : updatedElement.displayType || "flex",
                        flexDirection: computedFlexDirection,
                        alignItems:
                            property === "alignItems"
                                ? value
                                : updatedElement.alignItems || "flex-start",
                        justifyContent:
                            property === "justifyContent"
                                ? value
                                : updatedElement.justifyContent || "flex-start",
                        gap:
                            property === "gap"
                                ? `${value}px`
                                : `${updatedElement.gap || 0}px`,
                    };

                    await updateElementMutation.mutateAsync({
                        elementId: selectedId,
                        ...updatedElement,
                        styles: updatedStyles,
                    });
                } catch (error) {
                    console.error("Failed to update group property:", error);
                    // Revert local changes on error
                    setElements((prev) =>
                        prev.map((el) =>
                            el.id === selectedId ? selectedElement : el,
                        ),
                    );
                }
            }
        }
    };

    // Update functions with persistence
    const updateType = (newType: string) => {
        if (isGroupSelected && selectedId) {
            updateElementProperty("displayType", newType);
        } else {
            dispatch(updateAlignType(newType));
        }
    };

    const updateDirection = (direction: "row" | "column") => {
        if (isGroupSelected && selectedId) {
            updateElementProperty("flexDirection", direction);
        } else {
            dispatch(updateFlexDirection(direction));
        }
    };

    const updateReversed = (reversed: boolean) => {
        if (isGroupSelected && selectedId) {
            updateElementProperty("isReversed", reversed);
        } else {
            dispatch(updateIsReveresed(reversed));
        }
    };

    const updateJustify = (justify: string) => {
        if (isGroupSelected && selectedId) {
            updateElementProperty("justifyContent", justify);
        } else {
            dispatch(updateJustifyContent(justify));
        }
    };

    const updateAlign = (align: string) => {
        if (isGroupSelected && selectedId) {
            updateElementProperty("alignItems", align);
        } else {
            dispatch(updateAlignItems(align));
        }
    };

    const updateGapValue = (newGap: number) => {
        if (isGroupSelected && selectedId) {
            updateElementProperty("gap", newGap);
        } else {
            dispatch(updateGap(newGap));
        }
    };

    // Ungroup functionality
    const ungroupElements = async () => {
        if (
            !isGroupSelected ||
            !selectedId ||
            !updateElementMutation ||
            !deleteElementMutation
        )
            return;

        try {
            const groupElement = selectedElement;
            const childElements = elements.filter(
                (el) =>
                    groupElement.children &&
                    groupElement.children.includes(el.id),
            );

            // Update child positions to be absolute again
            for (const child of childElements) {
                const absoluteX =
                    (groupElement.position?.x || 0) + (child.position?.x || 0);
                const absoluteY =
                    (groupElement.position?.y || 0) + (child.position?.y || 0);

                await updateElementMutation.mutateAsync({
                    elementId: child.id,
                    position: { x: absoluteX, y: absoluteY },
                    styles: {
                        ...child.styles,
                        position: "absolute",
                    },
                });
            }

            // Update local state to remove the group
            setElements((prev) => prev.filter((el) => el.id !== selectedId));

            // Delete the group element from backend
            await deleteElementMutation.mutateAsync(selectedId);
        } catch (error) {
            console.error("Failed to ungroup elements:", error);
        }
    };

    // Get child count for groups
    const getChildCount = () => {
        if (!isGroupSelected || !selectedElement?.children) return 0;
        return selectedElement.children.length;
    };

    return (
        <div className="alignment-container toolbar-section">
            <div
                className="heading"
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <span>
                    Alignment{" "}
                    {isGroupSelected && `(Group - ${getChildCount()} items)`}
                </span>
                {isGroupSelected && (
                    <button
                        onClick={ungroupElements}
                        style={{
                            padding: "4px 8px",
                            fontSize: "11px",
                            background: "#ff4444",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                        }}
                        title="Ungroup elements"
                    >
                        <Ungroup size={12} strokeWidth={1.5} />
                        Ungroup
                    </button>
                )}
            </div>

            {!isGroupSelected && (
                <select
                    className="alignment-select"
                    value={type}
                    onChange={(e) => updateType(e.target.value)}
                >
                    <option value="flex">flex</option>
                    <option value="grid">grid</option>
                </select>
            )}

            {/* Display Type for Groups */}
            {isGroupSelected && (
                <div className="border-width-sub-section">
                    <div className="sub-heading">Display Type</div>
                    <select
                        className="alignment-select"
                        value={type}
                        onChange={(e) => updateType(e.target.value)}
                        style={{ width: "100%", marginBottom: "8px" }}
                    >
                        <option value="flex">flex</option>
                        <option value="grid">grid</option>
                        <option value="block">block</option>
                        <option value="inline-block">inline-block</option>
                    </select>
                </div>
            )}

            <div className="border-width-sub-section">
                <div className="sub-heading">Direction</div>
                <div className="flex-alignment-preview">
                    <div className="direction-wrapper">
                        <div className="direction-selector">
                            <button
                                className={`row ${flexDirection === "row" ? "active" : ""}`}
                                onClick={() => updateDirection("row")}
                            >
                                Row
                            </button>
                            <button
                                className={`column ${flexDirection === "column" ? "active" : ""}`}
                                onClick={() => updateDirection("column")}
                            >
                                Column
                            </button>
                        </div>

                        <button
                            onClick={() => updateReversed(!isReveresed)}
                            className={`reverse-selection ${isReveresed ? "active" : ""}`}
                            title={`Reverse ${flexDirection} direction`}
                        >
                            {flexDirection === "row" ? (
                                <ArrowLeft size={20} strokeWidth={1.25} />
                            ) : (
                                <ArrowUp size={20} strokeWidth={1.25} />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <div className="border-width-sub-section">
                <div className="sub-heading">Preview & Align Items</div>
                <div className="preview-tool-wrapper">
                    <div
                        className="preview-wrapper"
                        style={{
                            display: type === "flex" ? "flex" : "grid",
                            flexDirection:
                                type === "flex"
                                    ? getFlexDirection()
                                    : undefined,
                            gridTemplateColumns:
                                type === "grid" ? "1fr 1fr 1fr" : undefined,
                            gap: `${gap}px`,
                            justifyContent:
                                type === "flex" ? justifyContent : undefined,
                            alignItems:
                                type === "flex" ? alignItems : undefined,
                            alignContent:
                                type === "grid" ? alignItems : undefined,
                            placeItems:
                                type === "grid" ? alignItems : undefined,
                            backgroundColor: "#0b0b0c",
                            borderRadius: "4px",
                            padding: "8px",
                            minHeight: "60px",
                        }}
                    >
                        <div
                            className="box"
                            style={{
                                width: "20px",
                                height: "20px",
                                backgroundColor: "#007AFF",
                                color: "white",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "10px",
                                borderRadius: "2px",
                            }}
                        >
                            1
                        </div>
                        <div
                            className="box"
                            style={{
                                width: "20px",
                                height: "20px",
                                backgroundColor: "#FF6B35",
                                color: "white",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "10px",
                                borderRadius: "2px",
                            }}
                        >
                            2
                        </div>
                        <div
                            className="box"
                            style={{
                                width: "20px",
                                height: "20px",
                                backgroundColor: "#28A745",
                                color: "white",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "10px",
                                borderRadius: "2px",
                            }}
                        >
                            3
                        </div>
                    </div>

                    <div className="ai-wrapper">
                        <div className="ai-options">
                            <button
                                className={`start-option ${alignItems === "flex-start" ? "active" : ""}`}
                                onClick={() => updateAlign("flex-start")}
                                title="Align to start"
                            >
                                <AlignStartHorizontal
                                    size={20}
                                    strokeWidth={1.25}
                                />
                            </button>
                            <button
                                className={`center-option ${alignItems === "center" ? "active" : ""}`}
                                onClick={() => updateAlign("center")}
                                title="Align to center"
                            >
                                <AlignCenterHorizontal
                                    size={20}
                                    strokeWidth={1.25}
                                />
                            </button>
                            <button
                                className={`end-option ${alignItems === "flex-end" ? "active" : ""}`}
                                onClick={() => updateAlign("flex-end")}
                                title="Align to end"
                            >
                                <AlignEndHorizontal
                                    size={20}
                                    strokeWidth={1.25}
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-width-sub-section">
                <div className="sub-heading">Justify Content</div>
                <div className="jc-wrapper">
                    <div className="jc-options">
                        <button
                            className={`start-option ${justifyContent === "flex-start" ? "active" : ""}`}
                            onClick={() => updateJustify("flex-start")}
                            title="Justify to start"
                        >
                            <AlignStartVertical size={20} strokeWidth={1.25} />
                        </button>
                        <button
                            className={`center-option ${justifyContent === "center" ? "active" : ""}`}
                            onClick={() => updateJustify("center")}
                            title="Justify to center"
                        >
                            <AlignCenterVertical size={20} strokeWidth={1.25} />
                        </button>
                        <button
                            className={`end-option ${justifyContent === "flex-end" ? "active" : ""}`}
                            onClick={() => updateJustify("flex-end")}
                            title="Justify to end"
                        >
                            <AlignEndVertical size={20} strokeWidth={1.25} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="border-width-sub-section">
                <div className="sub-heading">Distribution & Stretch</div>

                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <button
                        className={`space-between-option ${justifyContent === "space-between" ? "active" : ""}`}
                        onClick={() => updateJustify("space-between")}
                        title="Space between"
                    >
                        <AlignHorizontalSpaceBetween
                            size={20}
                            strokeWidth={1.25}
                        />
                    </button>
                    <button
                        className={`space-around-option ${justifyContent === "space-around" ? "active" : ""}`}
                        onClick={() => updateJustify("space-around")}
                        title="Space around"
                    >
                        <AlignHorizontalSpaceAround
                            size={20}
                            strokeWidth={1.25}
                        />
                    </button>
                    <button
                        className={`stretch-option ${alignItems === "stretch" ? "active" : ""}`}
                        onClick={() => updateAlign("stretch")}
                        title="Stretch items"
                    >
                        <AlignVerticalJustifyCenter
                            size={20}
                            strokeWidth={1.25}
                        />
                    </button>
                </div>
            </div>

            <div className="border-width-sub-section">
                <div className="sub-heading">Gap</div>
                <div className="gap-wrapper">
                    <div className="gap-icon">Gap:</div>
                    <div
                        className="gap-value"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                        }}
                    >
                        <input
                            type="range"
                            min="0"
                            max="50"
                            value={gap}
                            onChange={(e) =>
                                updateGapValue(parseInt(e.target.value))
                            }
                            style={{ flex: 1 }}
                        />
                        <span style={{ minWidth: "40px", fontSize: "12px" }}>
                            {gap}px
                        </span>
                    </div>
                </div>
            </div>

            {/* Group-specific info */}
            {isGroupSelected && (
                <div
                    className="border-width-sub-section"
                    style={{
                        background: "rgba(0, 122, 255, 0.1)",
                        padding: "8px",
                        borderRadius: "4px",
                        border: "1px solid rgba(0, 122, 255, 0.2)",
                    }}
                >
                    <div className="sub-heading" style={{ color: "#007AFF" }}>
                        Group Info
                    </div>
                    <div style={{ fontSize: "11px", color: "#666" }}>
                        <div>Type: {selectedElement?.type}</div>
                        <div>Children: {getChildCount()}</div>
                        <div>Display: {type}</div>
                        <div>Direction: {getFlexDirection()}</div>
                    </div>
                </div>
            )}
        </div>
    );
};
