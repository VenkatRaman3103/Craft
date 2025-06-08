import React, { useState, useRef, useEffect, useCallback } from "react";
import "./index.scss";
import { ElementPicker } from "./ElementPicker";
import { RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { StoreState } from "@/store/store";
import { BorderControlPanel } from "./ToolBar/BroderControlPanel";
import { useSelector } from "react-redux";
import { FontsControlPanel } from "./ToolBar/FontsControlPanel";
import { useParams } from "react-router";
import { AlignmentControlPanel } from "./ToolBar/AlignmentControlPanel";
import { ScreenSizeSwitcher } from "./ScreenSizeSwitcher";
import { MetricSelection } from "./MetricSelector";
import { CanvasElement } from "@/Types/canvas/CanvasElement";
import { useCanvasApi } from "./useCanvasApi";
import { useDragAndDrop } from "./useDragAndDrop";

type Actions = "moving" | "scalling" | "grouping" | "grabbing";

export const Canvas: React.FC = () => {
    const { page_id } = useParams();
    const [selectedId, setSelectedId] = useState<number | string | null>(null);
    const [activeAction, setActiveAction] = useState<Actions>("moving");
    const [screen, setScreen] = useState<"mobile" | "desktop" | "tablet">(
        "desktop",
    );
    const [elementHeight, setElementHeight] = useState(100);
    const [elementWidth, setElementWidth] = useState(100);
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

    // store
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

    const { flexDirection, alignItems, justifyContent, gap } = useSelector(
        (state: StoreState) => state.alignmentControl,
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

    useEffect(() => {
        const selectedElement = getSelectedElement();
        if (selectedElement) {
            const width = parseInt(
                selectedElement.styles?.width?.replace("px", "") || "100",
            );
            const height = parseInt(
                selectedElement.styles?.height?.replace("px", "") || "100",
            );

            if (!isNaN(width)) setElementWidth(width);
            if (!isNaN(height)) setElementHeight(height);
        }
    }, [selectedId, elements]);

    const getSelectedElement = useCallback(() => {
        if (selectedId === null) return null;
        return findElementById(elements, selectedId);
    }, [selectedId, elements, findElementById]);

    const updateElementStyles = useCallback(async () => {
        if (selectedId === null) return;

        const selectedElement = getSelectedElement();
        if (!selectedElement) return;

        const updatedStyles = {
            ...selectedElement.styles,
            width: `${elementWidth}px`,
            height: `${elementHeight}px`,
            borderStyle: borderStyle,
            borderWidth:
                toggleAllSide_width === "all"
                    ? `${elementBoderWidth}px`
                    : `${topWidth}px ${rightWidth}px ${bottomWidth}px ${leftWidth}px`,
            borderRadius:
                toggleAllSide_radius === "all"
                    ? `${elementRadius}px`
                    : `${topLeftRadius}px ${topRightRadius}px ${bottomRightRadius}px ${bottomLeftRadius}px`,
            flexDirection: flexDirection,
            alignItems: alignItems,
            justifyContent: justifyContent,
            gap: `${gap}px`,
        };

        try {
            await updateElementMutation.mutateAsync({
                elementId: selectedId,
                styles: updatedStyles,
            });
        } catch (error) {
            console.error("Failed to update element styles:", error);
        }
    }, [
        selectedId,
        elementWidth,
        elementHeight,
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
        getSelectedElement,
        updateElementMutation,
    ]);

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
                border:
                    selectedId === element.id ? "2px solid #007bff" : "none",
                outline:
                    selectedId === element.id ? "1px dashed #007bff" : "none",
                outlineOffset: selectedId === element.id ? "2px" : "0",
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
                    {element.content && <span>{element.content}</span>}
                    {element.children?.length > 0 && (
                        <>
                            {element.children.map((child: any) =>
                                renderElement(child, level + 1),
                            )}
                        </>
                    )}
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

            <div className="toolbar-container">
                <div className="toolbar">
                    <div className="toolbar-header toolbar-section">
                        <button
                            className="save-changes-button header-button"
                            onClick={updateElementStyles}
                            disabled={
                                updateElementMutation.isPending ||
                                selectedId === null
                            }
                            style={{
                                backgroundColor:
                                    !updateElementMutation.isPending &&
                                    selectedId !== null
                                        ? "#28a745"
                                        : "#ccc",
                            }}
                        >
                            {updateElementMutation.isPending
                                ? "Saving..."
                                : "Save Changes"}
                        </button>

                        {createElementMutation.isPending && (
                            <div className="creating-status">
                                Creating element...
                            </div>
                        )}

                        <button
                            className="delete-button header-button"
                            onClick={deleteSelected}
                            disabled={
                                selectedId === null ||
                                deleteElementMutation.isPending
                            }
                            style={{
                                backgroundColor:
                                    selectedId !== null &&
                                    !deleteElementMutation.isPending
                                        ? "#dc3545"
                                        : "#ccc",
                                cursor:
                                    selectedId !== null &&
                                    !deleteElementMutation.isPending
                                        ? "pointer"
                                        : "not-allowed",
                            }}
                        >
                            {deleteElementMutation.isPending
                                ? "Deleting..."
                                : "Delete"}
                        </button>
                    </div>

                    <div className="dimenstion-cotainer toolbar-section">
                        <div className="heading">Dimensions</div>
                        <div className="dimensions">
                            <div className="element-height dimension">
                                <label>H</label>
                                <div className="divider"></div>
                                <input
                                    value={elementHeight}
                                    type="number"
                                    className="dimension-field"
                                    onChange={(e) =>
                                        setElementHeight(Number(e.target.value))
                                    }
                                />
                                <div className="divider"></div>
                                <MetricSelection />
                            </div>
                            <div className="element-width dimension">
                                <label>W</label>
                                <div className="divider"></div>
                                <input
                                    value={elementWidth}
                                    type="number"
                                    className="dimension-field"
                                    onChange={(e) =>
                                        setElementWidth(Number(e.target.value))
                                    }
                                />
                                <div className="divider"></div>
                                <MetricSelection />
                            </div>
                            <div className="dimension">0</div>
                        </div>
                    </div>

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

                    <div className="box-model-container toolbar-section">
                        <div className="heading">box model</div>
                        <div className="margin">
                            <div className="border">
                                <div className="padding">
                                    <div className="content"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
