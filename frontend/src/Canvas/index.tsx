import React, { useState, useRef, useEffect } from "react";
import "./index.scss";
import { ElementPicker } from "./ElementPicker";
import { elementType } from "@/Types/canvas/elementsType";
import { PublishFeature } from "./PublishFeature";

import { RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { StoreState } from "@/store/store";
import { BorderControlPanel } from "./ToolBar/BroderControlPanel";
import { useSelector } from "react-redux";
import { FontsControlPanel } from "./ToolBar/FontsControlPanel";
import { useParams } from "react-router";
import { getPageElements } from "@/api/canvas/pages/getPageElements";
import axios from "axios";
import { backendUrl } from "@/config";
import { AlignmentControlPanel } from "./ToolBar/AlignmentControlPanel";
import { ScreenSizeSwitcher } from "./ScreenSizeSwitcher";

export type CanvasElement = {
    id: number;
    type: elementType;
    x: number;
    y: number;
    width: number;
    "border-radius": number;
    height: number;
    text: string;
    color: string;
    "border-style": string;
    alignItems?: "flex-start" | "center" | "flex-end" | "stretch";
    justifyContent?:
        | "flex-start"
        | "center"
        | "flex-end"
        | "space-between"
        | "space-around";
    flexDirection?: "row" | "column";
    isReversed?: boolean;
    gap?: number;
    children?: CanvasElement[];
    isGroup?: boolean;
    groupLevel?: number;
};

type Actions = "moving" | "scalling" | "grouping" | "grabbing";

export const Canvas: React.FC = () => {
    // to get page_id
    const { page_id } = useParams();

    // fetch canvas page data
    const { data, isLoading, isError, refetch } = useQuery({
        queryFn: () => getPageElements(page_id),
        queryKey: ["canvas_page", page_id],
    });

    const updateElementMutation = useMutation({
        mutationFn: async ({
            elementId,
            styles,
        }: {
            elementId: string | number;
            styles: any;
        }) => {
            const response = await axios.patch(
                `${backendUrl}/canvas/pages/elements/${elementId}`,
                { styles },
            );
            return response.data;
        },
        onSuccess: () => {
            refetch();
        },
        onError: (error) => {
            console.error("Error updating element:", error);
        },
    });

    const deleteElementMutation = useMutation({
        mutationFn: async (elementId: string | number) => {
            const response = await axios.delete(
                `${backendUrl}/canvas/pages/elements/${elementId}`,
            );
            return response.data;
        },
        onSuccess: () => {
            refetch();
        },
        onError: (error) => {
            console.error("Error deleting element:", error);
        },
    });

    const createElementMutation = useMutation({
        mutationFn: async (elementData: any) => {
            const response = await axios.post(
                `${backendUrl}/canvas/pages/elements/${page_id}`,
                { elementData },
            );
            return response.data;
        },
        onSuccess: (data) => {
            refetch();
            if (data?.id) {
                setSelectedId(data.id);
            }
        },
        onError: (error) => {
            console.error("Error creating element:", error);
        },
    });

    console.log(data, "data: canvas");

    const [activeAction, setActiveAction] = useState<Actions>("moving");
    const [apiElements, setApiElements] = useState<any[]>([]);
    const [selectedId, setSelectedId] = useState<number | string | null>(null);

    const [screen, setScreen] = useState<"mobile" | "desktop" | "tablet">(
        "desktop",
    );

    const [elementHeight, setElementHeight] = useState(100);
    const [elementWidth, setElementWidth] = useState(100);

    const [pendingApiChanges, setPendingApiChanges] = useState<{
        [key: string]: any;
    }>({});

    // Drag and drop state
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });

    // border
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

    // alignment
    const {
        type,
        flexDirection,
        isReveresed,
        alignItems,
        justifyContent,
        gap,
    } = useSelector((state: StoreState) => state.alignmentControl);

    const [toggleAllSide_radius, setToggleAllSide_radius] = useState<
        "all" | "specific"
    >("all");
    const [toggleAllSide_width, setToggleAllSide_width] = useState<
        "all" | "specific"
    >("all");

    const canvasRef = useRef<HTMLDivElement | null>(null);

    // zoom in and out
    const [zoomLevel, setZoomLevel] = useState(1);
    const maxZoomLevel = 3;
    const minZoomLevel = 0.3;
    const zoomStepper = 0.1;

    useEffect(() => {
        if (data?.elements) {
            setApiElements(data.elements);
        }
    }, [data]);

    const getSelectedElement = () => {
        if (selectedId === null) return null;
        return findApiElementById(apiElements, selectedId);
    };

    const findApiElementById = (elements: any[], id: string | number): any => {
        for (const element of elements) {
            if (element.id === id) return element;
            if (element.children?.length > 0) {
                const found = findApiElementById(element.children, id);
                if (found) return found;
            }
        }
        return null;
    };

    const updatePendingApiChanges = (
        elementId: string | number,
        changes: any,
    ) => {
        setPendingApiChanges((prev) => ({
            ...prev,
            [elementId]: {
                ...prev[elementId],
                ...changes,
            },
        }));
    };

    const savePendingApiChanges = async () => {
        if (selectedId === null) return;

        const selectedElement = getSelectedElement();
        if (!selectedElement) return;

        const currentPendingChanges = pendingApiChanges[selectedId] || {};

        const currentLeft =
            currentPendingChanges.left || selectedElement.styles?.left || "0px";
        const currentTop =
            currentPendingChanges.top || selectedElement.styles?.top || "0px";

        const updatedStyles = {
            ...selectedElement.styles,
            ...currentPendingChanges,
            left: currentLeft,
            top: currentTop,
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

        updateElementMutation.mutate({
            elementId: selectedId,
            styles: updatedStyles,
        });

        setPendingApiChanges((prev) => {
            const updated = { ...prev };
            delete updated[selectedId];
            return updated;
        });
    };

    const deleteApiElement = async (elementId: string | number) => {
        deleteElementMutation.mutate(elementId);
        if (selectedId === elementId) {
            setSelectedId(null);
        }
        setPendingApiChanges((prev) => {
            const updated = { ...prev };
            delete updated[elementId];
            return updated;
        });
    };

    const handleMouseDown = (
        e: React.MouseEvent,
        elementId: string | number,
    ) => {
        if (activeAction !== "moving") return;

        e.preventDefault();
        e.stopPropagation();

        setSelectedId(elementId);
        setIsDragging(true);

        const canvasRect = canvasRef.current?.getBoundingClientRect();
        if (!canvasRect) return;

        const mouseX = (e.clientX - canvasRect.left) / zoomLevel;
        const mouseY = (e.clientY - canvasRect.top) / zoomLevel;

        const element = findApiElementById(apiElements, elementId);
        if (!element) return;

        const currentLeft = parseFloat(
            element.styles?.left?.replace("px", "") || "0",
        );
        const currentTop = parseFloat(
            element.styles?.top?.replace("px", "") || "0",
        );

        setDragOffset({
            x: mouseX - currentLeft,
            y: mouseY - currentTop,
        });

        setDragStartPos({ x: currentLeft, y: currentTop });
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging || selectedId === null) return;

        const canvasRect = canvasRef.current?.getBoundingClientRect();
        if (!canvasRect) return;

        const mouseX = (e.clientX - canvasRect.left) / zoomLevel;
        const mouseY = (e.clientY - canvasRect.top) / zoomLevel;

        const newLeft = Math.max(0, mouseX - dragOffset.x);
        const newTop = Math.max(0, mouseY - dragOffset.y);

        updatePendingApiChanges(selectedId, {
            left: `${newLeft}px`,
            top: `${newTop}px`,
        });
    };

    const handleMouseUp = () => {
        if (isDragging && selectedId !== null) {
            const pendingChanges = pendingApiChanges[selectedId] || {};
            if (pendingChanges.left || pendingChanges.top) {
                const selectedElement = getSelectedElement();
                if (selectedElement) {
                    const updatedStyles = {
                        ...selectedElement.styles,
                        ...pendingChanges,
                        left:
                            pendingChanges.left ||
                            selectedElement.styles?.left ||
                            "0px",
                        top:
                            pendingChanges.top ||
                            selectedElement.styles?.top ||
                            "0px",
                    };

                    updateElementMutation.mutate({
                        elementId: selectedId,
                        styles: updatedStyles,
                    });

                    setPendingApiChanges((prev) => {
                        const updated = { ...prev };
                        if (updated[selectedId]) {
                            delete updated[selectedId].left;
                            delete updated[selectedId].top;
                        }
                        return updated;
                    });
                }
            }
        }

        setIsDragging(false);
        setDragOffset({ x: 0, y: 0 });
        setDragStartPos({ x: 0, y: 0 });
    };

    useEffect(() => {
        if (isDragging) {
            const handleGlobalMouseMove = (e: MouseEvent) => handleMouseMove(e);
            const handleGlobalMouseUp = () => handleMouseUp();

            document.addEventListener("mousemove", handleGlobalMouseMove);
            document.addEventListener("mouseup", handleGlobalMouseUp);

            return () => {
                document.removeEventListener(
                    "mousemove",
                    handleGlobalMouseMove,
                );
                document.removeEventListener("mouseup", handleGlobalMouseUp);
            };
        }
    }, [isDragging, selectedId, dragOffset, zoomLevel, pendingApiChanges]);

    useEffect(() => {
        const selectedElement = getSelectedElement();
        if (selectedElement) {
            if (selectedElement.styles?.width) {
                const width = parseInt(
                    selectedElement.styles.width.replace("px", ""),
                );
                if (!isNaN(width)) setElementWidth(width);
            }
            if (selectedElement.styles?.height) {
                const height = parseInt(
                    selectedElement.styles.height.replace("px", ""),
                );
                if (!isNaN(height)) setElementHeight(height);
            }
        }
    }, [selectedId, apiElements]);

    useEffect(() => {
        if (selectedId !== null) {
            updatePendingApiChanges(selectedId, {
                width: `${elementWidth}px`,
                height: `${elementHeight}px`,
            });
        }
    }, [elementWidth, elementHeight, selectedId]);

    useEffect(() => {
        if (selectedId !== null) {
            updatePendingApiChanges(selectedId, {
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
            });
        }
    }, [
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
        selectedId,
    ]);

    const addElement = async (type: CanvasElement["type"]) => {
        const newElementData = {
            type: "div",
            parentId: null,
            styles: {
                position: "absolute",
                left: "100px",
                top: "100px",
                width: `${elementWidth}px`,
                height: `${elementHeight}px`,
                backgroundColor: getRandomColor(),
                borderStyle: borderStyle,
                borderWidth: `${elementBoderWidth}px`,
                borderColor: "#000",
                borderRadius: `${elementRadius}px`,
                display: "flex",
                flexDirection: flexDirection,
                alignItems: alignItems,
                justifyContent: justifyContent,
                gap: `${gap}px`,
                cursor: activeAction === "moving" ? "move" : "default",
                boxSizing: "border-box",
            },
            content: type === "text" ? "Text element" : "",
            attributes: {},
            order: apiElements.length,
            name: `${type}_${Date.now()}`,
        };

        createElementMutation.mutate(newElementData);
    };

    const getRandomColor = (): string => {
        const colors = [
            "#FF6633",
            "#FFB399",
            "#FF33FF",
            "#FFFF99",
            "#00B3E6",
            "#E6B333",
            "#3366E6",
            "#999966",
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === canvasRef.current) {
            setSelectedId(null);
        }
    };

    const deleteSelected = async () => {
        if (selectedId !== null) {
            await deleteApiElement(selectedId);
            setSelectedId(null);
        }
    };

    const ZoomIconSize = 16;

    const canvasStyle = {
        transform: `scale(${zoomLevel})`,
        transformOrigin: "top left",
        transition: isDragging ? "none" : "transform 0.1s ease-out",
    };

    const handleZoomIn = () => {
        setZoomLevel(Math.min(zoomLevel + zoomStepper, maxZoomLevel));
    };

    const handleZoomOut = () => {
        setZoomLevel(Math.max(zoomLevel - zoomStepper, minZoomLevel));
    };

    const handleZoomReset = () => {
        setZoomLevel(1);
    };

    const getApiElementStyle = (element: any) => {
        const baseStyle = {
            position: "absolute" as const,
            cursor: activeAction === "moving" ? "move" : "default",
            border: selectedId === element.id ? "2px solid #007bff" : "none",
            outline: selectedId === element.id ? "1px dashed #007bff" : "none",
            outlineOffset: selectedId === element.id ? "2px" : "0",
            userSelect: "none" as const,
            zIndex:
                selectedId === element.id ? 1000 : element.styles?.zIndex || 1,
        };

        const pendingChanges = pendingApiChanges[element.id] || {};

        return {
            ...baseStyle,
            ...element.styles,
            ...pendingChanges,
            ...(element.responsiveStyles?.[screen] || {}),
        };
    };

    const renderElement = (element: any, level: number = 0) => {
        const handleElementClick = (e: React.MouseEvent) => {
            e.stopPropagation();
            if (!isDragging) {
                setSelectedId(element.id);
            }
        };

        return (
            <div
                key={element.id}
                style={getApiElementStyle(element)}
                onClick={handleElementClick}
                onMouseDown={(e) => handleMouseDown(e, element.id)}
                title={element.name}
            >
                {element.content && <span>{element.content}</span>}
                {element.children && element.children.length > 0 && (
                    <>
                        {element.children.map((child: any) =>
                            renderElement(child, level + 1),
                        )}
                    </>
                )}
            </div>
        );
    };

    const hasUnsavedApiChanges =
        selectedId !== null &&
        pendingApiChanges[selectedId] &&
        Object.keys(pendingApiChanges[selectedId]).length > 0;

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
                    {apiElements.map((element) => renderElement(element))}
                </div>
            </div>

            <div className="status-bar-container">
                <ScreenSizeSwitcher screen={screen} setScreen={setScreen} />

                <div className="zoom-buttons-container">
                    <div
                        className="zoom-out-btn zoom-btn"
                        onClick={() => handleZoomOut()}
                    >
                        <ZoomOut size={ZoomIconSize} />
                    </div>
                    {zoomLevel != 1 && (
                        <div
                            className="zoom-reset-btn zoom-btn"
                            onClick={() => handleZoomReset()}
                        >
                            <RotateCcw size={ZoomIconSize} />
                        </div>
                    )}
                    <div
                        className="zoom-in-btn zoom-btn"
                        onClick={() => handleZoomIn()}
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
                        {hasUnsavedApiChanges && (
                            <button
                                className="save-changes-button header-button"
                                onClick={savePendingApiChanges}
                                disabled={updateElementMutation.isPending}
                                style={{
                                    backgroundColor:
                                        !updateElementMutation.isPending
                                            ? "#28a745"
                                            : "#ccc",
                                }}
                            >
                                {updateElementMutation.isPending
                                    ? "Saving..."
                                    : "Save Changes"}
                            </button>
                        )}

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
                                deleteElementMutation.isLoading
                            }
                            style={{
                                backgroundColor:
                                    selectedId !== null &&
                                    !deleteElementMutation.isLoading
                                        ? "#dc3545"
                                        : "#ccc",
                                cursor:
                                    selectedId !== null &&
                                    !deleteElementMutation.isLoading
                                        ? "pointer"
                                        : "not-allowed",
                            }}
                        >
                            {deleteElementMutation.isLoading
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
                        elements={apiElements}
                        setElements={setApiElements}
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

const MetricSelection = () => {
    const [selectedMetric, setSelectedMetric] = useState<
        "px" | "%" | "vw" | "vh"
    >("px");
    const [showMetricPopup, setShowMetricPopup] = useState(false);

    return (
        <div className="metric-selection">
            {showMetricPopup && (
                <div className="metric-selection-popup">
                    <div className="metric-option">px</div>
                    <div className="metric-option">%</div>
                    <div className="metric-option">vw</div>
                </div>
            )}
            <div className="divider"></div>
            <div
                className="metric-display"
                onClick={() => setShowMetricPopup(!showMetricPopup)}
            >
                {selectedMetric}
            </div>
        </div>
    );
};
