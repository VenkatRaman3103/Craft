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
} from "lucide-react";
import { StoreState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { CanvasElement } from "@/Canvas";

export const AlignmentControlPanel = ({
    selectedId,
    elements,
    setElements,
}: {
    selectedId: number | null;
    elements: CanvasElement[];
    setElements: React.Dispatch<React.SetStateAction<CanvasElement[]>>;
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

    const getFlexDirection = () => {
        if (flexDirection === "row") {
            return isReveresed ? "row-reverse" : "row";
        } else {
            return isReveresed ? "column-reverse" : "column";
        }
    };

    const updateElementProperty = (property: string, value: any) => {
        if (isGroupSelected && selectedId) {
            setElements((prev) =>
                prev.map((el) =>
                    el.id === selectedId ? { ...el, [property]: value } : el,
                ),
            );
        }
    };

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

    return (
        <div className="alignment-container toolbar-section">
            <div className="heading">
                Alignment {isGroupSelected && "(Group)"}
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

            <div className="border-width-sub-section">
                <div className="sub-heading">directions</div>
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
                <div className="sub-heading">directions</div>
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
                            >
                                <AlignStartHorizontal
                                    size={20}
                                    strokeWidth={1.25}
                                />
                            </button>
                            <button
                                className={`center-option ${alignItems === "center" ? "active" : ""}`}
                                onClick={() => updateAlign("center")}
                            >
                                <AlignCenterHorizontal
                                    size={20}
                                    strokeWidth={1.25}
                                />
                            </button>
                            <button
                                className={`end-option ${alignItems === "flex-end" ? "active" : ""}`}
                                onClick={() => updateAlign("flex-end")}
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
                <div className="sub-heading">directions</div>
                <div className="jc-wrapper">
                    <div className="jc-options">
                        <button
                            className={`start-option ${justifyContent === "flex-start" ? "active" : ""}`}
                            onClick={() => updateJustify("flex-start")}
                        >
                            <AlignStartVertical size={20} strokeWidth={1.25} />
                        </button>
                        <button
                            className={`center-option ${justifyContent === "center" ? "active" : ""}`}
                            onClick={() => updateJustify("center")}
                        >
                            <AlignCenterVertical size={20} strokeWidth={1.25} />
                        </button>
                        <button
                            className={`end-option ${justifyContent === "flex-end" ? "active" : ""}`}
                            onClick={() => updateJustify("flex-end")}
                        >
                            <AlignEndVertical size={20} strokeWidth={1.25} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="border-width-sub-section">
                <div className="sub-heading">directions</div>

                <div>
                    <button
                        className={`space-between-option ${justifyContent === "space-between" ? "active" : ""}`}
                        onClick={() => updateJustify("space-between")}
                    >
                        <AlignHorizontalSpaceBetween
                            size={20}
                            strokeWidth={1.25}
                        />
                    </button>
                    <button
                        className={`space-around-option ${justifyContent === "space-around" ? "active" : ""}`}
                        onClick={() => updateJustify("space-around")}
                    >
                        <AlignHorizontalSpaceAround
                            size={20}
                            strokeWidth={1.25}
                        />
                    </button>
                    <button
                        className={`stretch-option ${alignItems === "stretch" ? "active" : ""}`}
                        onClick={() => updateAlign("stretch")}
                    >
                        <AlignVerticalJustifyCenter
                            size={20}
                            strokeWidth={1.25}
                        />
                    </button>
                </div>
            </div>

            <div className="border-width-sub-section">
                <div className="sub-heading">directions</div>
                <div className="gap-wrapper">
                    <div className="gap-icon">Gap:</div>
                    <div className="gap-value">
                        <input
                            type="range"
                            min="0"
                            max="50"
                            value={gap}
                            onChange={(e) =>
                                updateGapValue(parseInt(e.target.value))
                            }
                        />
                        <span>{gap}px</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
