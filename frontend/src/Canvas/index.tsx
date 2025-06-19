import React, { useState, useRef, useEffect, useCallback } from "react";
import "./index.scss";
import { ElementPicker } from "./ElementPicker";
import { Minus, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
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

import { ToolBarHeader } from "./ToolBar/ToolBarHeader";
import { ControlPanelSelect } from "@/components/canvas/ControlPanelSelect";
import {
    updateElementContent,
    updateTextWrap,
} from "@/store/toolbar/contentControl/contentControl";

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
        // add new border properties
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
        // add new dimension properties
    } = useSelector((state: StoreState) => state.dimensionControl);

    // Alignment control properties
    const { flexDirection, alignItems, justifyContent, gap } = useSelector(
        (state: StoreState) => state.alignmentControl,
    );

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
    // This useEffect reads styles from selected element and updates Redux store
    // Add new property reading logic here in the same structure
    useEffect(() => {
        const selectedElement = getSelectedElement();
        if (selectedElement) {
            // DIMENSION PROPERTIES - Read and dispatch to Redux
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

            // BORDER PROPERTIES - Read and dispatch to Redux
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

            // CONTENT PROPERTIES - Read and dispatch to Redux
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
        }
    }, [selectedId, elements, dispatch]);

    const getSelectedElement = useCallback(() => {
        if (selectedId === null) return null;
        return findElementById(elements, selectedId);
    }, [selectedId, elements, findElementById]);

    useEffect(() => {
        console.log("Content in Redux:", elementContent);
        console.log("Text Wrap in Redux:", textWrap);
    }, [elementContent, textWrap]);

    // NOTE: 4 - ELEMENT STYLE WRITING (WRITE FROM REDUX TO ELEMENT STYLES)
    // This function takes Redux state and applies it to the selected element
    // Add new properties to the updatedStyles object
    const updateElementStyles = useCallback(async () => {
        if (selectedId === null) return;

        const selectedElement = getSelectedElement();
        if (!selectedElement) return;

        const isTextElement =
            selectedElement.type === "p" || selectedElement.type === "h1";

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
            flexDirection: flexDirection,
            alignItems: alignItems,
            justifyContent: justifyContent,
            gap: `${gap}px`,

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
        flexDirection,
        alignItems,
        justifyContent,
        gap,
        textWrap,
        getSelectedElement,
        updateElementMutation,
    ]);

    // NOTE: 5 - ELEMENT CREATION WITH DEFAULT VALUES
    // When creating new elements, include default values for new properties
    const addElement = useCallback(
        async (type: CanvasElement["type"]) => {
            const newElementData = createDefaultElement(
                type,
                elementWidth,
                elementHeight,
                borderStyle,
                elementBoderWidth,
                elementRadius,
                flexDirection,
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
            flexDirection,
            alignItems,
            justifyContent,
            gap,
            elements.length,
            createDefaultElement,
            createElementMutation,
            elementOverFlow,
            textWrap,
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

    const renderElement = useCallback(
        (element: any, level: number = 0) => {
            const handleElementClick = (e: React.MouseEvent) => {
                e.stopPropagation();
                if (!isDragging) {
                    setSelectedId(element.id);
                }
            };

            const renderElementContent = () => {
                console.log(element.type, "elementType");
                switch (element.type) {
                    case "text":
                        return (
                            <input
                                type="text"
                                placeholder={
                                    element.attributes?.placeholder ||
                                    "Enter text..."
                                }
                                defaultValue={element.content}
                                style={{
                                    border: "none",
                                    background: "transparent",
                                    outline: "none",
                                    width: "100%",
                                    height: "100%",
                                }}
                            />
                        );
                    case "textarea":
                        return (
                            <textarea
                                placeholder={
                                    element.attributes?.placeholder ||
                                    "Enter textarea..."
                                }
                                defaultValue={element.content}
                                style={{
                                    border: "none",
                                    background: "transparent",
                                    outline: "none",
                                    width: "100%",
                                    height: "100%",
                                    resize: "none",
                                }}
                            />
                        );
                    case "checkbox":
                        return (
                            <input
                                type="checkbox"
                                defaultValue={element.content}
                                style={{
                                    border: "none",
                                    background: "transparent",
                                    outline: "none",
                                    width: "100%",
                                    height: "100%",
                                }}
                            />
                        );
                    case "p":
                        return (
                            <p
                                style={{
                                    border: "none",
                                    background: "transparent",
                                    outline: "none",
                                    width: "auto",
                                    height: "auto",
                                    margin: 0,
                                    padding: "8px",
                                    minWidth: "50px",
                                }}
                            >
                                {element.content || "Enter paragraph"}
                            </p>
                        );
                    case "h1":
                        return (
                            <h1
                                style={{
                                    border: "none",
                                    background: "transparent",
                                    outline: "none",
                                    width: "auto",
                                    height: "auto",
                                    margin: 0,
                                    padding: "8px",
                                    minWidth: "50px",
                                }}
                            >
                                {element.content || "Enter Heading"}
                            </h1>
                        );
                    case "radio":
                        return (
                            <input
                                type="radio"
                                defaultValue={element.content}
                                style={{
                                    border: "none",
                                    background: "transparent",
                                    outline: "none",
                                    width: "100%",
                                    height: "100%",
                                }}
                            />
                        );
                    case "button":
                        return <button>{element.content || "Button"}</button>;
                    default:
                        return (
                            <>
                                {element.content && (
                                    <span>{element.content}</span>
                                )}
                                {element.children?.length > 0 && (
                                    <>
                                        {element.children.map((child: any) =>
                                            renderElement(child, level + 1),
                                        )}
                                    </>
                                )}
                            </>
                        );
                }
            };

            return (
                <div
                    key={element.id}
                    style={getElementStyle(element)}
                    onClick={handleElementClick}
                    onMouseDown={(e) => {
                        if (activeAction === "moving") {
                            handleMouseDown(e, element.id, setSelectedId);
                        }
                    }}
                    title={element.name}
                >
                    {renderElementContent()}
                </div>
            );
        },
        [getElementStyle, isDragging, activeAction, handleMouseDown],
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
    // Create handlers for new properties following this pattern
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

// NOTE: 8 - CONTROL PANEL COMPONENTS
// Follow this structure when creating new control panels
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
    const isTextElement =
        selectedElement?.type === "p" || selectedElement?.type === "h1";

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

export const ContentControlPanel = ({
    elementContent,
    handleContentChange,
    textWrap,
    handleTextWrapChange,
    selectedElement,
}: {
    elementContent: string;
    handleContentChange: (value: string) => void;
    textWrap: string;
    handleTextWrapChange: (value: string) => void;
    selectedElement: any;
}) => {
    const isTextElement =
        selectedElement?.type === "p" || selectedElement?.type === "h1";

    return (
        <div className="content-section-container toolbar-section">
            <div className="heading">Content</div>
            <div className="content-field-container">
                <div className="content-field">
                    <label>Text</label>
                    <div className="divider"></div>
                    <textarea
                        value={elementContent}
                        className="content-textarea"
                        onChange={(e) => handleContentChange(e.target.value)}
                        placeholder="Enter text content..."
                        rows={3}
                    />
                </div>
            </div>

            {/* Add Text Wrap Control for text elements */}
            {isTextElement && (
                <ControlPanelSelect
                    options={[
                        { value: "normal", label: "Wrap" },
                        { value: "nowrap", label: "No Wrap" },
                        { value: "pre", label: "Pre" },
                        { value: "pre-wrap", label: "Pre Wrap" },
                        { value: "pre-line", label: "Pre Line" },
                    ]}
                    sectionTitle="Text Wrap"
                    elementStyle={textWrap}
                    updateDispatch={updateTextWrap}
                />
            )}
        </div>
    );
};
