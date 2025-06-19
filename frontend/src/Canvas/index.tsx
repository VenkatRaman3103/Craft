import React, { useState, useRef, useEffect, useCallback } from "react";
import "./index.scss";
import { ElementPicker, elementsHash } from "./ElementPicker";
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
    Minus,
    RotateCcw,
    ZoomIn,
    ZoomOut,
} from "lucide-react";
import { StoreState } from "@/store/store";
import { BorderControlPanel } from "./ToolBar/BroderControlPanel";
import { useSelector, useDispatch } from "react-redux";
import { FontsControlPanel } from "./ToolBar/FontsControlPanel";
import { useParams } from "react-router";
import { AlignmentControlPanel } from "./ToolBar/AlignmentControlPanel";
import { ScreenSizeSwitcher } from "./ScreenSizeSwitcher";
import { MetricSelection } from "./MetricSelector";
import { CanvasElement } from "@/Types/canvas/CanvasElement";
import { useCanvasApi } from "./useCanvasApi";
import { useDragAndDrop } from "./useDragAndDrop";
import { useElementRenderer } from "./ElementRenderer";

// NOTE: 1 - IMPORT ACTION CREATORS
import {
    updateBoderRadius,
    updateRightWidth,
    updateLeftWidth,
    updateBottomWidth,
    updateTopWidth,
    updateElementBoderWidth,
    updateBottomLeftRadius,
    updateBottomRightRadius,
    updateTopRightRadius,
    updateTopLeftRadius,
    updateBorderStyle,
} from "@/store/toolbar/borderControl/borderControl";

import {
    updateElementWidth,
    updateElementHeight,
    updateElementMinWidth,
    updateElementMinHeight,
    updateElementMaxWidth,
    updateElementMaxHeight,
    updateElementOverFlow,
    overflowType,
} from "@/store/toolbar/dimensionControl/dimensionControl";

import {
    updateAlignType,
    updateAlignItems,
    updateIsReveresed,
    updateFlexDirection,
    updateJustifyContent,
    updateGap,
} from "@/store/toolbar/alignmentControl/alignmentControl";

import { ToolBarHeader } from "./ToolBar/ToolBarHeader";
import { ControlPanelSelect } from "@/components/canvas/ControlPanelSelect";
import {
    updateElementContent,
    updateTextWrap,
} from "@/store/toolbar/contentControl/contentControl";
import { ContentControlPanel } from "./ToolBar/ContentControlPanel";

type Actions = "moving" | "scalling" | "grouping" | "grabbing";

export const Canvas: React.FC = () => {
    const { page_id } = useParams();
    const dispatch = useDispatch();
    const [selectedId, setSelectedId] = useState<number | string | null>(null);
    const [activeAction, setActiveAction] = useState<Actions>("moving");
    const [screen, setScreen] = useState<"mobile" | "desktop" | "tablet">(
        "desktop",
    );
    const [zoomLevel, setZoomLevel] = useState(1);

    // Toggle states
    const [toggleAllSide_radius, setToggleAllSide_radius] = useState<
        "all" | "specific"
    >("all");
    const [toggleAllSide_width, setToggleAllSide_width] = useState<
        "all" | "specific"
    >("all");

    const canvasRef = useRef<HTMLDivElement | null>(null);

    // Zoom constants
    const maxZoomLevel = 3;
    const minZoomLevel = 0.3;
    const zoomStepper = 0.1;
    const ZoomIconSize = 16;

    // NOTE: 2 - REDUX STATE SELECTORS
    // Add new property selectors here by category

    // Border control properties
    const {
        elementRadius,
        topLeftRadius,
        topRightRadius,
        bottomRightRadius,
        bottomLeftRadius,
        elementBoderWidth,
        topWidth,
        bottomWidth,
        leftWidth,
        rightWidth,
        borderStyle,
    } = useSelector((state: StoreState) => state.borderControl);

    // Dimension control properties
    const {
        elementHeight,
        elementWidth,
        elementMinWidth,
        elementMaxWidth,
        elementMinHeight,
        elementMaxHeight,
        elementOverFlow,
    } = useSelector((state: StoreState) => state.dimensionControl);

    const {
        type: alignType,
        flexDirection,
        alignItems,
        justifyContent,
        gap,
        isReveresed,
    } = useSelector((state: StoreState) => state.alignmentControl);

    // Content control properties
    const { elementContent, textWrap } = useSelector(
        (state: StoreState) => state.contentControl,
    );

    // hooks
    const {
        elements,
        isLoading,
        isError,
        updateElementMutation,
        deleteElementMutation,
        createElementMutation,
        findElementById,
        updateElementPosition,
        createDefaultElement,
    } = useCanvasApi({
        pageId: page_id,
        onElementCreate: setSelectedId,
        onElementDelete: (elementId) => {
            if (selectedId === elementId) {
                setSelectedId(null);
            }
        },
    });

    const handleDragEnd = useCallback(
        async (
            elementId: string | number,
            newPosition: { x: number; y: number },
        ) => {
            try {
                await updateElementPosition(elementId, newPosition);
            } catch (error) {
                console.error("Failed to update element position:", error);
            }
        },
        [updateElementPosition],
    );

    const { isDragging, handleMouseDown, handleMouseMove, handleMouseUp } =
        useDragAndDrop({
            zoomLevel,
            canvasRef,
            onDragEnd: handleDragEnd,
            findElementById,
            elements,
        });

    useEffect(() => {
        if (isDragging) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);

            return () => {
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
            };
        }
    }, [isDragging, handleMouseMove, handleMouseUp]);

    // NOTE: 3 - ELEMENT STYLE READING
    useEffect(() => {
        const selectedElement = getSelectedElement();
        if (selectedElement) {
            // DIMENSION PROPERTIES
            const width = parseInt(
                selectedElement.styles?.width?.replace("px", "") || "100",
            );
            const height = parseInt(
                selectedElement.styles?.height?.replace("px", "") || "100",
            );

            if (!isNaN(width)) dispatch(updateElementWidth(width));
            if (!isNaN(height)) dispatch(updateElementHeight(height));

            const minWidth = parseInt(
                selectedElement.styles?.minWidth?.replace("px", "") || "auto",
            );
            const minHeight = parseInt(
                selectedElement.styles?.minHeight?.replace("px", "") || "auto",
            );

            if (!isNaN(minWidth)) dispatch(updateElementMinWidth(minWidth));
            if (!isNaN(minHeight)) dispatch(updateElementMinHeight(minHeight));

            const maxWidth = selectedElement.styles?.maxWidth;
            const maxHeight = selectedElement.styles?.maxHeight;

            if (maxWidth === "none" || maxWidth === undefined) {
                dispatch(updateElementMaxWidth("none"));
            } else {
                const maxWidthValue = parseInt(maxWidth.replace("px", ""));
                if (!isNaN(maxWidthValue))
                    dispatch(updateElementMaxWidth(maxWidthValue));
            }

            if (maxHeight === "none" || maxHeight === undefined) {
                dispatch(updateElementMaxHeight("none"));
            } else {
                const maxHeightValue = parseInt(maxHeight.replace("px", ""));
                if (!isNaN(maxHeightValue))
                    dispatch(updateElementMaxHeight(maxHeightValue));
            }

            const overflow = selectedElement.styles?.overflow || "visible";
            dispatch(updateElementOverFlow(overflow as overflowType));

            // BORDER PROPERTIES
            const borderWidth = selectedElement.styles?.borderWidth;
            const borderRadius = selectedElement.styles?.borderRadius;
            const borderStyleValue = selectedElement.styles?.borderStyle;

            if (borderWidth) {
                const borderWidthValues = borderWidth
                    .replace(/px/g, "")
                    .split(" ")
                    .map((v) => parseInt(v));

                if (borderWidthValues.length === 1) {
                    const widthValue = borderWidthValues[0];
                    if (!isNaN(widthValue)) {
                        dispatch(updateElementBoderWidth(widthValue));
                        setToggleAllSide_width("all");
                    }
                } else if (borderWidthValues.length === 4) {
                    const [top, right, bottom, left] = borderWidthValues;
                    if (!isNaN(top)) dispatch(updateTopWidth(top));
                    if (!isNaN(right)) dispatch(updateRightWidth(right));
                    if (!isNaN(bottom)) dispatch(updateBottomWidth(bottom));
                    if (!isNaN(left)) dispatch(updateLeftWidth(left));
                    setToggleAllSide_width("specific");
                }
            }

            if (borderRadius) {
                const borderRadiusValues = borderRadius
                    .replace(/px/g, "")
                    .split(" ")
                    .map((v) => parseInt(v));

                if (borderRadiusValues.length === 1) {
                    const radiusValue = borderRadiusValues[0];
                    if (!isNaN(radiusValue)) {
                        dispatch(updateBoderRadius(radiusValue));
                        setToggleAllSide_radius("all");
                    }
                } else if (borderRadiusValues.length === 4) {
                    const [topLeft, topRight, bottomRight, bottomLeft] =
                        borderRadiusValues;
                    if (!isNaN(topLeft)) dispatch(updateTopLeftRadius(topLeft));
                    if (!isNaN(topRight))
                        dispatch(updateTopRightRadius(topRight));
                    if (!isNaN(bottomRight))
                        dispatch(updateBottomRightRadius(bottomRight));
                    if (!isNaN(bottomLeft))
                        dispatch(updateBottomLeftRadius(bottomLeft));
                    setToggleAllSide_radius("specific");
                }
            }

            if (borderStyleValue) {
                dispatch(updateBorderStyle(borderStyleValue));
            }

            const elementFlexDirection =
                selectedElement.styles?.flexDirection || "row";
            const elementAlignItems =
                selectedElement.styles?.alignItems || "flex-start";
            const elementJustifyContent =
                selectedElement.styles?.justifyContent || "flex-start";
            const elementGap = selectedElement.styles?.gap
                ? parseInt(selectedElement.styles.gap.replace("px", ""))
                : 0;
            const elementDisplay = selectedElement.styles?.display || "flex";

            const isReversed = elementFlexDirection.includes("reverse");
            const baseDirection = isReversed
                ? elementFlexDirection.includes("row")
                    ? "row"
                    : "column"
                : elementFlexDirection;

            dispatch(updateFlexDirection(baseDirection));
            dispatch(updateAlignItems(elementAlignItems));
            dispatch(updateJustifyContent(elementJustifyContent));
            dispatch(updateGap(elementGap));
            dispatch(updateAlignType(elementDisplay));
            dispatch(updateIsReveresed(isReversed));

            // CONTENT PROPERTIES
            const content = selectedElement.content || "";
            dispatch(updateElementContent(content));

            const whiteSpace = selectedElement.styles?.whiteSpace || "normal";
            dispatch(updateTextWrap(whiteSpace));
        } else {
            // RESET VALUES WHEN NO ELEMENT IS SELECTED
            dispatch(updateElementOverFlow("visible"));
            dispatch(updateElementWidth(100));
            dispatch(updateElementHeight(100));
            dispatch(updateElementMinWidth(0));
            dispatch(updateElementMinHeight(0));
            dispatch(updateElementMaxWidth("none"));
            dispatch(updateElementMaxHeight("none"));
            dispatch(updateElementContent(""));
            dispatch(updateTextWrap("normal"));
            dispatch(updateFlexDirection("row"));
            dispatch(updateAlignItems("flex-start"));
            dispatch(updateJustifyContent("flex-start"));
            dispatch(updateGap(0));
            dispatch(updateAlignType("flex"));
            dispatch(updateIsReveresed(false));
        }
    }, [selectedId, elements, dispatch]);

    const getSelectedElement = useCallback(() => {
        if (selectedId === null) return null;
        return findElementById(elements, selectedId);
    }, [selectedId, elements, findElementById]);

    const getComputedFlexDirection = useCallback(() => {
        if (flexDirection === "row") {
            return isReveresed ? "row-reverse" : "row";
        } else {
            return isReveresed ? "column-reverse" : "column";
        }
    }, [flexDirection, isReveresed]);

    // NOTE: 4 - ELEMENT STYLE WRITING
    const updateElementStyles = useCallback(async () => {
        if (selectedId === null) return;

        const selectedElement = getSelectedElement();
        if (!selectedElement) return;

        // const isTextElement =
        //     selectedElement.type === "p" || selectedElement.type === "h1";

        const isTextElement = elementsHash.text.includes(selectedElement?.type);

        const updatedStyles = {
            ...selectedElement.styles,
            // DIMENSION PROPERTIES
            width:
                isTextElement && textWrap === "nowrap"
                    ? "auto"
                    : `${elementWidth}px`,
            height:
                isTextElement && textWrap === "nowrap"
                    ? "auto"
                    : `${elementHeight}px`,
            minWidth:
                isTextElement && textWrap === "nowrap"
                    ? "auto"
                    : `${elementMinWidth}px`,
            minHeight:
                isTextElement && textWrap === "nowrap"
                    ? "auto"
                    : `${elementMinHeight}px`,
            maxWidth:
                isTextElement && textWrap === "nowrap"
                    ? "none"
                    : elementMaxWidth === "none"
                      ? "none"
                      : `${elementMaxWidth}px`,
            maxHeight:
                isTextElement && textWrap === "nowrap"
                    ? "none"
                    : elementMaxHeight === "none"
                      ? "none"
                      : `${elementMaxHeight}px`,
            overflow: elementOverFlow || "visible",

            // BORDER PROPERTIES
            borderStyle: borderStyle,
            borderWidth:
                toggleAllSide_width === "all"
                    ? `${elementBoderWidth}px`
                    : `${topWidth}px ${rightWidth}px ${bottomWidth}px ${leftWidth}px`,
            borderRadius:
                toggleAllSide_radius === "all"
                    ? `${elementRadius}px`
                    : `${topLeftRadius}px ${topRightRadius}px ${bottomRightRadius}px ${bottomLeftRadius}px`,

            // ALIGNMENT PROPERTIES
            display: alignType,
            flexDirection: getComputedFlexDirection(),
            alignItems: alignItems,
            justifyContent: justifyContent,
            gap: `${gap}px`,

            // TEXT PROPERTIES
            whiteSpace: textWrap,

            backgroundColor: isTextElement
                ? "transparent"
                : selectedElement.styles?.backgroundColor || "transparent",
        };

        const updatePayload = {
            styles: updatedStyles,
            content: elementContent,
        };

        try {
            await updateElementMutation.mutateAsync({
                elementId: selectedId,
                ...updatePayload,
            });
        } catch (error) {
            console.error("Failed to update element styles:", error);
        }
    }, [
        selectedId,
        elementWidth,
        elementHeight,
        elementMinWidth,
        elementMinHeight,
        elementMaxWidth,
        elementMaxHeight,
        elementContent,
        elementOverFlow,
        borderStyle,
        elementBoderWidth,
        topWidth,
        bottomWidth,
        leftWidth,
        rightWidth,
        elementRadius,
        topLeftRadius,
        topRightRadius,
        bottomRightRadius,
        bottomLeftRadius,
        toggleAllSide_width,
        toggleAllSide_radius,
        alignType,
        alignItems,
        justifyContent,
        gap,
        textWrap,
        getSelectedElement,
        updateElementMutation,
        getComputedFlexDirection,
    ]);

    // NOTE: 5 - ELEMENT CREATION WITH DEFAULT VALUES
    const addElement = useCallback(
        async (type: CanvasElement["type"]) => {
            const newElementData = createDefaultElement(
                type,
                elementWidth,
                elementHeight,
                borderStyle,
                elementBoderWidth,
                elementRadius,
                getComputedFlexDirection(),
                alignItems,
                justifyContent,
                gap,
                elements.length,
                elementOverFlow,
                elementMinHeight,
                elementMinWidth,
                elementMaxHeight,
                elementMaxWidth,
                textWrap,
                alignType,
            );

            try {
                await createElementMutation.mutateAsync(newElementData);
            } catch (error) {
                console.error("Failed to create element:", error);
            }
        },
        [
            elementWidth,
            elementHeight,
            elementMinHeight,
            elementMinWidth,
            elementMaxHeight,
            elementMaxWidth,
            borderStyle,
            elementBoderWidth,
            elementRadius,
            alignItems,
            justifyContent,
            gap,
            alignType,
            elements.length,
            createDefaultElement,
            createElementMutation,
            elementOverFlow,
            textWrap,
            getComputedFlexDirection,
        ],
    );

    const deleteSelected = useCallback(async () => {
        if (selectedId !== null) {
            try {
                await deleteElementMutation.mutateAsync(selectedId);
                setSelectedId(null);
            } catch (error) {
                console.error("Failed to delete element:", error);
            }
        }
    }, [selectedId, deleteElementMutation]);

    const handleCanvasClick = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (e.target === canvasRef.current) {
                setSelectedId(null);
            }
        },
        [],
    );

    // Zoom functions
    const handleZoomIn = useCallback(() => {
        setZoomLevel((prev) => Math.min(prev + zoomStepper, maxZoomLevel));
    }, []);

    const handleZoomOut = useCallback(() => {
        setZoomLevel((prev) => Math.max(prev - zoomStepper, minZoomLevel));
    }, []);

    const handleZoomReset = useCallback(() => {
        setZoomLevel(1);
    }, []);

    const getElementStyle = useCallback(
        (element: any) => {
            return {
                position: "absolute" as const,
                cursor: activeAction === "moving" ? "move" : "default",
                userSelect: "none" as const,
                zIndex:
                    selectedId === element.id
                        ? 1000
                        : element.styles?.zIndex || 1,
                transition: isDragging ? "none" : "all 0.1s ease",
                ...element.styles,
                ...(element.responsiveStyles?.[screen] || {}),
            };
        },
        [selectedId, activeAction, isDragging, screen],
    );

    const { renderElement } = useElementRenderer(
        isDragging,
        activeAction,
        getElementStyle,
        handleMouseDown,
        setSelectedId,
    );

    const canvasStyle = {
        transform: `scale(${zoomLevel})`,
        transformOrigin: "top left",
        transition: isDragging ? "none" : "transform 0.1s ease-out",
    };

    if (isLoading) {
        return <div className="figma-container">Loading...</div>;
    }

    if (isError) {
        return <div className="figma-container">Error loading canvas data</div>;
    }

    // NOTE: 6 - PROPERTY CHANGE HANDLERS
    const handleWidthChange = (value: number) => {
        dispatch(updateElementWidth(value));
    };

    const handleHeightChange = (value: number) => {
        dispatch(updateElementHeight(value));
    };

    const handleContentChange = (value: string) => {
        dispatch(updateElementContent(value));
    };

    const handleTextWrapChange = (value: string) => {
        dispatch(updateTextWrap(value));
    };

    return (
        <div className="figma-container">
            <div
                className="canvas-container"
                ref={canvasRef}
                onClick={handleCanvasClick}
                style={{
                    overflow: "hidden",
                    position: "relative",
                    cursor: isDragging ? "grabbing" : "default",
                }}
            >
                <div className={`canvas ${screen}`} style={canvasStyle}>
                    {elements.map((element) => renderElement(element))}
                </div>
            </div>

            <div className="status-bar-container">
                <ScreenSizeSwitcher screen={screen} setScreen={setScreen} />

                <div className="zoom-buttons-container">
                    <div
                        className="zoom-out-btn zoom-btn"
                        onClick={handleZoomOut}
                    >
                        <ZoomOut size={ZoomIconSize} />
                    </div>
                    {zoomLevel !== 1 && (
                        <div
                            className="zoom-reset-btn zoom-btn"
                            onClick={handleZoomReset}
                        >
                            <RotateCcw size={ZoomIconSize} />
                        </div>
                    )}
                    <div
                        className="zoom-in-btn zoom-btn"
                        onClick={handleZoomIn}
                    >
                        <ZoomIn size={ZoomIconSize} />
                    </div>
                </div>

                <div className="publish-container">publish</div>
            </div>

            <ElementPicker
                addElement={addElement}
                activeAction={activeAction}
                setActiveAction={setActiveAction}
                selectedId={selectedId}
            />

            {/* NOTE: 7 - CONTROL PANELS */}
            <div className="toolbar-container">
                <div className="toolbar">
                    <ToolBarHeader
                        updateElementStyles={updateElementStyles}
                        updateElementMutation={updateElementMutation}
                        selectedId={selectedId}
                        createElementMutation={createElementMutation}
                        deleteSelected={deleteSelected}
                        deleteElementMutation={deleteElementMutation}
                    />

                    <DimensionControlPanel
                        elementHeight={elementHeight}
                        handleHeightChange={handleHeightChange}
                        elementWidth={elementWidth}
                        handleWidthChange={handleWidthChange}
                        elementOverFlow={elementOverFlow}
                        elementMinWidth={elementMinWidth}
                        elementMaxWidth={elementMaxWidth}
                        elementMinHeight={elementMinHeight}
                        elementMaxHeight={elementMaxHeight}
                        selectedElement={getSelectedElement()}
                        textWrap={textWrap}
                    />

                    <ContentControlPanel
                        elementContent={elementContent}
                        handleContentChange={handleContentChange}
                        textWrap={textWrap}
                        handleTextWrapChange={handleTextWrapChange}
                        selectedElement={getSelectedElement()}
                    />

                    <BorderControlPanel
                        toggleAllSide_radius={toggleAllSide_radius}
                        toggleAllSide_width={toggleAllSide_width}
                        setToggleAllSide_radius={setToggleAllSide_radius}
                        setToggleAllSide_width={setToggleAllSide_width}
                    />

                    <AlignmentControlPanel
                        selectedId={selectedId}
                        elements={elements}
                        setElements={() => {}}
                    />

                    <FontsControlPanel />
                </div>
            </div>
        </div>
    );
};

export const DimensionControlPanel = ({
    elementHeight,
    elementWidth,
    elementMaxWidth,
    elementMinWidth,
    elementMaxHeight,
    elementMinHeight,
    handleHeightChange,
    handleWidthChange,
    elementOverFlow,
    selectedElement,
    textWrap,
}: any) => {
    // const isTextElement =
    //     selectedElement?.type === "p" || selectedElement?.type === "h1";

    const isTextElement = elementsHash.text.includes(selectedElement?.type);

    const isDimensionDisabled = isTextElement && textWrap === "nowrap";

    return (
        <div className="dimenstion-cotainer toolbar-section">
            <div className="heading">Dimensions</div>
            <div className="dimensions">
                <div className="element-height dimension">
                    <label>H</label>
                    <div className="divider"></div>
                    <input
                        value={isDimensionDisabled ? "auto" : elementHeight}
                        type={isDimensionDisabled ? "text" : "number"}
                        className="dimension-field"
                        onChange={(e) =>
                            !isDimensionDisabled &&
                            handleHeightChange(Number(e.target.value))
                        }
                        disabled={isDimensionDisabled}
                        placeholder={isDimensionDisabled ? "auto" : ""}
                    />
                    <div className="divider"></div>
                    <MetricSelection />
                </div>
                <div className="element-width dimension">
                    <label>W</label>
                    <div className="divider"></div>
                    <input
                        value={isDimensionDisabled ? "auto" : elementWidth}
                        type={isDimensionDisabled ? "text" : "number"}
                        className="dimension-field"
                        onChange={(e) =>
                            !isDimensionDisabled &&
                            handleWidthChange(Number(e.target.value))
                        }
                        disabled={isDimensionDisabled}
                        placeholder={isDimensionDisabled ? "auto" : ""}
                    />
                    <div className="divider"></div>
                    <MetricSelection />
                </div>
                <div className="dimension">0</div>
            </div>

            {!isDimensionDisabled && (
                <>
                    <div className="border-width-sub-section">
                        <div className="sub-heading">Max</div>
                        <div className="border-width-tools-container">
                            <div className="boder-width-adjustments-container">
                                <div className="boder-width-adjustments">
                                    <ControlPanelInput
                                        value={elementMaxWidth}
                                        updateDispatch={updateElementMaxWidth}
                                    />
                                    <ControlPanelInput
                                        value={elementMaxHeight}
                                        updateDispatch={updateElementMaxHeight}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-width-sub-section">
                        <div className="sub-heading">Min</div>
                        <div className="border-width-tools-container">
                            <div className="boder-width-adjustments-container">
                                <div className="boder-width-adjustments">
                                    <ControlPanelInput
                                        value={elementMinWidth}
                                        updateDispatch={updateElementMinWidth}
                                    />
                                    <ControlPanelInput
                                        value={elementMinHeight}
                                        updateDispatch={updateElementMinHeight}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            <ControlPanelSelect
                options={[
                    { value: "visible", label: "visible" },
                    { value: "hidden", label: "hidden" },
                    { value: "scroll", label: "scroll" },
                    { value: "auto", label: "auto" },
                ]}
                sectionTitle="Overflow"
                elementStyle={elementOverFlow}
                updateDispatch={updateElementOverFlow}
            />
        </div>
    );
};

export type InputType = {
    value: any;
    updateDispatch: any;
};

export const ControlPanelInput = ({ value, updateDispatch }: InputType) => {
    const dispatch = useDispatch();
    return (
        <div className="border-width border-tool">
            <div className="border-width-icon">
                <Minus size={14} />
            </div>
            <input
                type="number"
                value={value}
                onChange={(e) =>
                    dispatch(updateDispatch(Number(e.target.value)))
                }
            />
        </div>
    );
};
