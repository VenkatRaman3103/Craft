import React, { useState, useRef, useEffect, useCallback } from "react";
import "./index.scss";
import { ElementPicker, elementsHash } from "./ElementPicker";
import { Minus } from "lucide-react";
import { StoreState } from "@/store/store";
import { BorderControlPanel } from "./ToolBar/BroderControlPanel";
import { useSelector, useDispatch } from "react-redux";
import { FontsControlPanel } from "./ToolBar/FontsControlPanel";
import { useParams } from "react-router";
import { AlignmentControlPanel } from "./ToolBar/AlignmentControlPanel";
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
    updateFontFamily,
    updateFontWeight,
    updateFontSize,
    updateFontStyle,
    updateTextDecoration,
    updateTextAlign,
    updateLineHeight,
    updateLetterSpacing,
} from "@/store/toolbar/fontsControl/fontsControl";

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

// NOTE: ADD COLOR CONTROL IMPORTS
import {
    updateBackgroundColor,
    updateBorderColor,
    updateTextColor,
    updateShadowColor,
    updateGradientStart,
    updateGradientEnd,
    updateGradientDirection,
    updateUseGradient,
} from "@/store/toolbar/colorControl/colorControl";

import { ToolBarHeader } from "./ToolBar/ToolBarHeader";
import { ControlPanelSelect } from "@/components/canvas/ControlPanelSelect";
import {
    updateContentSourceId,
    updateElementContent,
    updateKeyPath,
    updateTextWrap,
} from "@/store/toolbar/contentControl/contentControl";
import { ContentControlPanel } from "./ToolBar/ContentControlPanel";
import { DimensionControlPanel } from "./ToolBar/DimensionControlPanel";
import { ColorControlPanel } from "./ToolBar/ColorControlPanel";
import { ZoomingControl } from "./Zooming";
import { updateContentSource } from "@/store/toolbar/contentControl/contentControl";

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

    // Alignment control
    const {
        type: alignType,
        flexDirection,
        alignItems,
        justifyContent,
        gap,
        isReveresed,
    } = useSelector((state: StoreState) => state.alignmentControl);

    // Content control properties
    const {
        elementContent,
        textWrap,
        contentSource,
        contentSourceId,
        keyPath,
    } = useSelector((state: StoreState) => state.contentControl);

    // fonts control
    const {
        fontFamily,
        fontWeight,
        fontSize,
        fontStyle,
        textDecoration,
        textAlign,
        lineHeight,
        letterSpacing,
    } = useSelector((state: StoreState) => state.fontControl);

    // color control
    const {
        backgroundColor,
        borderColor,
        textColor,
        shadowColor,
        gradientStart,
        gradientEnd,
        gradientDirection,
        useGradient,
    } = useSelector((state: StoreState) => state.colorControl);

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

    // Helper function to get computed background
    const getComputedBackground = useCallback(() => {
        if (useGradient) {
            return `linear-gradient(${gradientDirection}, ${gradientStart}, ${gradientEnd})`;
        }
        return backgroundColor;
    }, [
        useGradient,
        gradientDirection,
        gradientStart,
        gradientEnd,
        backgroundColor,
    ]);

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

            // FONTS PROPERTIES
            const elementFontFamily =
                selectedElement.styles?.fontFamily || "Arial, sans-serif";
            const elementFontWeight =
                selectedElement.styles?.fontWeight || "normal";
            const elementFontSize = selectedElement.styles?.fontSize
                ? parseInt(selectedElement.styles.fontSize.replace("px", ""))
                : 16;
            const elementFontStyle =
                selectedElement.styles?.fontStyle || "normal";
            const elementTextDecoration =
                selectedElement.styles?.textDecoration || "none";
            const elementTextAlign =
                selectedElement.styles?.textAlign || "left";
            const elementLineHeight = selectedElement.styles?.lineHeight
                ? parseFloat(selectedElement.styles.lineHeight.toString())
                : 1.5;
            const elementLetterSpacing = selectedElement.styles?.letterSpacing
                ? parseFloat(
                      selectedElement.styles.letterSpacing.replace("px", ""),
                  )
                : 0;

            dispatch(updateFontFamily(elementFontFamily));
            dispatch(updateFontWeight(elementFontWeight));
            dispatch(updateFontSize(elementFontSize));
            dispatch(updateFontStyle(elementFontStyle));
            dispatch(updateTextDecoration(elementTextDecoration));
            dispatch(updateTextAlign(elementTextAlign));
            dispatch(updateLineHeight(elementLineHeight));
            dispatch(updateLetterSpacing(elementLetterSpacing));

            // COLOR PROPERTIES
            const elementBackgroundColor =
                selectedElement.styles?.backgroundColor || "#ffffff";
            const elementBorderColor =
                selectedElement.styles?.borderColor || "#000000";
            const elementTextColor = selectedElement.styles?.color || "#000000";
            const elementBoxShadow = selectedElement.styles?.boxShadow || "";

            const elementBackground =
                selectedElement.styles?.background ||
                selectedElement.styles?.backgroundColor ||
                "#ffffff";
            if (elementBackground.includes("linear-gradient")) {
                dispatch(updateUseGradient(true));
                const gradientMatch = elementBackground.match(
                    /linear-gradient\((.+?),\s*(.+?),\s*(.+?)\)/,
                );
                if (gradientMatch) {
                    const [, direction, startColor, endColor] = gradientMatch;
                    dispatch(updateGradientDirection(direction.trim()));
                    dispatch(updateGradientStart(startColor.trim()));
                    dispatch(updateGradientEnd(endColor.trim()));
                }
            } else {
                dispatch(updateUseGradient(false));
                dispatch(updateBackgroundColor(elementBackground));
            }

            dispatch(updateBorderColor(elementBorderColor));
            dispatch(updateTextColor(elementTextColor));

            if (elementBoxShadow) {
                const shadowColorMatch = elementBoxShadow.match(
                    /rgba?\([^)]+\)|#[a-fA-F0-9]{3,6}/,
                );
                if (shadowColorMatch) {
                    dispatch(updateShadowColor(shadowColorMatch[0]));
                }
            }

            const elementContentSource = selectedElement.contentSource || "raw";
            dispatch(updateContentSource(elementContentSource));

            const elementContentSourceId =
                selectedElement.contentSourceId || "";
            dispatch(updateContentSourceId(elementContentSourceId));

            const elementKeyPath = selectedElement.keyPath || "";
            dispatch(updateKeyPath(elementKeyPath));
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

            dispatch(updateFontFamily("Arial, sans-serif"));
            dispatch(updateFontWeight("normal"));
            dispatch(updateFontSize(16));
            dispatch(updateFontStyle("normal"));
            dispatch(updateTextDecoration("none"));
            dispatch(updateTextAlign("left"));
            dispatch(updateLineHeight(1.5));
            dispatch(updateLetterSpacing(0));

            dispatch(updateBackgroundColor("#ffffff"));
            dispatch(updateBorderColor("#000000"));
            dispatch(updateTextColor("#000000"));
            dispatch(updateShadowColor("#000000"));
            dispatch(updateGradientStart("#ffffff"));
            dispatch(updateGradientEnd("#000000"));
            dispatch(updateGradientDirection("to right"));
            dispatch(updateUseGradient(false));

            dispatch(updateContentSource("raw"));
            dispatch(updateContentSourceId(""));
            dispatch(updateKeyPath(""));
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
            borderColor: borderColor,
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
            color: textColor,

            // FONTS PROPERTIES
            fontFamily: fontFamily,
            fontWeight: fontWeight,
            fontSize: `${fontSize}px`,
            fontStyle: fontStyle,
            textDecoration: textDecoration,
            textAlign: textAlign,
            lineHeight: lineHeight,
            letterSpacing: `${letterSpacing}px`,

            // COLOR PROPERTIES
            background: useGradient ? getComputedBackground() : undefined,
            backgroundColor: useGradient
                ? undefined
                : isTextElement
                  ? "transparent"
                  : backgroundColor,
        };

        const updatePayload = {
            styles: updatedStyles,
            content: elementContent,
            contentSource: contentSource,
            contentSourceId: contentSourceId,
            keyPath: keyPath,
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
        contentSource,
        keyPath,
        contentSourceId,
        elementOverFlow,
        borderStyle,
        borderColor,
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
        textColor,
        fontFamily,
        fontWeight,
        fontSize,
        fontStyle,
        textDecoration,
        textAlign,
        lineHeight,
        letterSpacing,
        backgroundColor,
        useGradient,
        getComputedBackground,
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
                fontFamily,
                fontWeight,
                fontSize,
                fontStyle,
                textDecoration,
                textAlign,
                lineHeight,
                letterSpacing,
                backgroundColor,
                borderColor,
                textColor,
                useGradient,
                getComputedBackground(),
                contentSource,
                contentSourceId,
                keyPath,
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
            borderColor,
            elementBoderWidth,
            elementRadius,
            alignItems,
            justifyContent,
            gap,
            keyPath,
            alignType,
            fontFamily,
            fontWeight,
            fontSize,
            fontStyle,
            textDecoration,
            textAlign,
            lineHeight,
            letterSpacing,
            backgroundColor,
            textColor,
            useGradient,
            getComputedBackground,
            elements.length,
            createDefaultElement,
            createElementMutation,
            elementOverFlow,
            textWrap,
            getComputedFlexDirection,
            contentSource,
            contentSourceId,
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

    const handleBackgroundColorChange = (value: string) => {
        dispatch(updateBackgroundColor(value));
    };

    const handleBorderColorChange = (value: string) => {
        dispatch(updateBorderColor(value));
    };

    const handleTextColorChange = (value: string) => {
        dispatch(updateTextColor(value));
    };

    const handleShadowColorChange = (value: string) => {
        dispatch(updateShadowColor(value));
    };

    const handleGradientStartChange = (value: string) => {
        dispatch(updateGradientStart(value));
    };

    const handleGradientEndChange = (value: string) => {
        dispatch(updateGradientEnd(value));
    };

    const handleGradientDirectionChange = (value: string) => {
        dispatch(updateGradientDirection(value));
    };

    const handleUseGradientChange = (value: boolean) => {
        dispatch(updateUseGradient(value));
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

            <ZoomingControl
                screen={screen}
                setScreen={setScreen}
                zoomLevel={zoomLevel}
                setZoomLevel={setZoomLevel}
            />

            <ElementPicker
                addElement={addElement}
                activeAction={activeAction}
                setActiveAction={setActiveAction}
                selectedId={selectedId}
            />

            {/* NOTE: 8 - CONTROL PANELS */}
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

                    <ContentControlPanel
                        elementContent={elementContent}
                        handleContentChange={handleContentChange}
                        textWrap={textWrap}
                        handleTextWrapChange={handleTextWrapChange}
                        selectedElement={getSelectedElement()}
                    />

                    <ColorControlPanel
                        selectedElement={getSelectedElement()}
                        backgroundColor={backgroundColor}
                        borderColor={borderColor}
                        textColor={textColor}
                        shadowColor={shadowColor}
                        gradientStart={gradientStart}
                        gradientEnd={gradientEnd}
                        gradientDirection={gradientDirection}
                        useGradient={useGradient}
                        onBackgroundColorChange={handleBackgroundColorChange}
                        onBorderColorChange={handleBorderColorChange}
                        onTextColorChange={handleTextColorChange}
                        onShadowColorChange={handleShadowColorChange}
                        onGradientStartChange={handleGradientStartChange}
                        onGradientEndChange={handleGradientEndChange}
                        onGradientDirectionChange={
                            handleGradientDirectionChange
                        }
                        onUseGradientChange={handleUseGradientChange}
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
