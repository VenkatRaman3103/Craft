import React, { useState, useRef, useEffect } from "react";
import "./index.scss";
import { ElementPicker } from "./ElementPicker";
import { elementType } from "@/Types/canvas/elementsType";
import { PublishFeature } from "./PublishFeature";

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
    Monitor,
    RotateCcw,
    Settings,
    Smartphone,
    Tablet,
    ZoomIn,
    ZoomOut,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    createNewScreen,
    deleteScreenSize,
    getScreenSizes,
    udpateScreenSizeStatus,
    updateScreenSize,
} from "@/api/screenSizes";
import { StoreState } from "@/store/store";
import { BorderControlPanel } from "./ToolBar/BroderControlPanel";
import { useDispatch, useSelector } from "react-redux";
import { FontsControlPanel } from "./ToolBar/FontsControlPanel";
import { getPageById } from "@/api/canvas/pages/getPageById";
import { useParams } from "react-router";
import { getPageElements } from "@/api/canvas/pages/getPageElements";
import axios from "axios";
import { backendUrl } from "@/config";

type CanvasElement = {
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

    // React Query mutations
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

        const updatedStyles = {
            ...selectedElement.styles,
            ...currentPendingChanges,
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
        transition: "transform 0.1s ease-out",
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
            position: "relative" as const,
            cursor: activeAction === "moving" ? "move" : "default",
            border: selectedId === element.id ? "2px solid #007bff" : "none",
            outline: selectedId === element.id ? "1px dashed #007bff" : "none",
            outlineOffset: selectedId === element.id ? "2px" : "0",
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
            setSelectedId(element.id);
        };

        return (
            <div
                key={element.id}
                style={getApiElementStyle(element)}
                onClick={handleElementClick}
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

                <div className="publish-container">
                    <PublishFeature
                        elements={apiElements}
                        elementWidth={elementWidth}
                        elementHeight={elementHeight}
                        elementRadius={elementRadius}
                        topRightRadius={topRightRadius}
                        topLeftRadius={topLeftRadius}
                        bottomRightRadius={bottomRightRadius}
                        bottomLeftRadius={bottomLeftRadius}
                        toggleAllSide_radius={toggleAllSide_radius}
                        toggleAllSide_width={toggleAllSide_width}
                        elementBorderStyle={borderStyle}
                        elementBoderWidth={elementBoderWidth}
                        leftWidth={leftWidth}
                        rightWidth={rightWidth}
                        topWidth={topWidth}
                        bottomWidth={bottomWidth}
                    />
                </div>
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

export const ScreenSizeSwitcher = ({ screen, setScreen }: any) => {
    const [showScreenSetting, setShowScreenSetting] = useState<boolean>(false);
    const [activeOptionId, setActiveOptionId] = useState<null | string>(null);
    const [showScreenPrompt, setShowScreenPrompt] = useState(false);
    const [selectedOption, setSelectedOption] = useState<null | string>(null);
    const [listOfScreens, setListOfScreens] = useState([]);
    const [newName, setNewName] = useState("");
    const [newWidth, setNewWidth] = useState("");
    const [newHeight, setNewHeight] = useState("");
    const [editName, setEditName] = useState("");
    const [editWidth, setEditWidth] = useState("");
    const [editHeight, setEditHeight] = useState("");

    const [activeScreenToggle, setActiveScreenToggle] = useState("");

    const screenSizeDropRef = useRef(null);

    const queryClient = useQueryClient();
    const { data } = useQuery({
        queryFn: () => getScreenSizes(),
        queryKey: ["screen-size"],
    });

    const createNewScreenMutation = useMutation({
        mutationFn: (payload) => createNewScreen(payload),
        onSuccess: () => {
            setNewWidth("");
            setNewHeight("");
            setNewName("");
            setShowScreenPrompt(false);
            setSelectedOption(null);

            queryClient.invalidateQueries(["screen-size"]);
        },
    });

    const deleteScreenMutation = useMutation({
        mutationFn: (id) => deleteScreenSize(id),
        onSuccess: () => {
            queryClient.invalidateQueries(["screen-size"]);
        },
    });

    const updateScreenSizeMutation = useMutation({
        mutationFn: ({ id, updates }) => {
            console.log(`Updating screen ${id} with:`, updates);
            return updateScreenSize(id, updates);
        },
        onSuccess: () => {
            console.log("Screen size update successful");
            queryClient.invalidateQueries(["screen-size"]);
        },
        onError: (error) => {
            console.error("Screen size update failed:", error);
        },
    });

    const toggleActiveScreenMutation = useMutation({
        mutationFn: ({ id, screenType, status }) =>
            udpateScreenSizeStatus(id, screenType, status),
        onSuccess: () => queryClient.invalidateQueries(["screen-size"]),
    });

    useEffect(() => {
        setListOfScreens(data);
    }, [data]);

    useEffect(() => {
        function handleClickOutSide(event) {
            if (
                screenSizeDropRef.current &&
                !screenSizeDropRef.current.contains(event.target)
            ) {
                setShowScreenSetting(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutSide);
        return () => {
            document.removeEventListener("mousedown", handleClickOutSide);
        };
    }, []);

    const screenIconsSize = 14;
    console.log(data, "dataScreenSizeSwitcher");

    const handleCancel = () => {
        setSelectedOption(null);
        setEditName("");
        setEditWidth("");
        setEditHeight("");
    };

    const handleSave = (item) => {
        console.log("Save button clicked for item:", item);
        console.log("Edit states:", { editName, editWidth, editHeight });

        const updates = {};

        if (editName && editName !== item.name) {
            updates.name = editName;
        }

        if (editWidth && String(editWidth) !== String(item.width)) {
            updates.width = editWidth;
        }

        if (editHeight && String(editHeight) !== String(item.heigth)) {
            updates.heigth = editHeight;
        }

        if (Object.keys(updates).length > 0) {
            updateScreenSizeMutation.mutate({ id: item.id, updates });
        }

        setSelectedOption(null);
        setEditName("");
        setEditWidth("");
        setEditHeight("");
    };

    const handleStartEdit = (item) => {
        setSelectedOption(item.id);
        setEditName(item.name);
        setEditWidth(item.width);
        setEditHeight(item.heigth);
    };

    const handleNewName = (e) => {
        e.preventDefault();
        setNewName(e.target.value);
    };

    const handleNewWidth = (e) => {
        e.preventDefault();
        setNewWidth(e.target.value);
    };

    const handleNewHeight = (e) => {
        e.preventDefault();
        setNewHeight(e.target.value);
    };

    const handleEditName = (e) => {
        e.preventDefault();
        setEditName(e.target.value);
    };

    const handleEditWidth = (e) => {
        e.preventDefault();
        setEditWidth(e.target.value);
    };

    const handleEditHeight = (e) => {
        e.preventDefault();
        setEditHeight(e.target.value);
    };

    const handleNewScreenSize = () => {
        const payload = {
            name: newName,
            heigth: newHeight,
            width: newWidth,
            screenType: screen,
        };
        console.log(payload, "payloadNewScreen");

        createNewScreenMutation.mutate(payload);
    };

    const handleDeleteScreenSize = (id) => {
        deleteScreenMutation.mutate(id);
    };

    const handleToggleActiveScreen = (id) => {
        const temp = { id, screenType: screen, status: "active" };
        toggleActiveScreenMutation.mutate(temp);
    };

    return (
        <div className="device-size-switcher-container">
            <div className="device-size-switcher">
                <div
                    className={`mobile-screen screen-btn ${screen == "mobile" ? "active" : ""}`}
                    onClick={() => setScreen("mobile")}
                >
                    <Smartphone size={screenIconsSize} />
                </div>
                <div
                    className={`desktop-screen screen-btn ${screen == "desktop" ? "active" : ""}`}
                    onClick={() => setScreen("desktop")}
                >
                    <Monitor size={screenIconsSize} />
                </div>
                <div
                    className={`tablet-screen screen-btn ${screen == "tablet" ? "active" : ""}`}
                    onClick={() => setScreen("tablet")}
                >
                    <Tablet size={screenIconsSize} />
                </div>
            </div>
            {showScreenSetting && (
                <div
                    className="settings-drop-down-container"
                    ref={screenSizeDropRef}
                >
                    <div className="settings-drop-down-wrapper">
                        <div className="settings-heading">{screen}</div>

                        {listOfScreens
                            ?.filter((item) => item.screenType == screen)
                            .map((item) => (
                                <div
                                    key={item.id}
                                    className="setting-option-container"
                                >
                                    <div className="screen-heading-wrapper">
                                        {selectedOption === item.id ? (
                                            <input
                                                className="screen-heading"
                                                value={editName}
                                                onChange={handleEditName}
                                            />
                                        ) : (
                                            <input
                                                className="screen-heading"
                                                value={item.name}
                                                readOnly
                                            />
                                        )}

                                        <div
                                            className={`select-toggle-button ${item.status}`}
                                            onClick={() =>
                                                handleToggleActiveScreen(
                                                    item.id,
                                                )
                                            }
                                        >
                                            <div className="toggle-button"></div>
                                        </div>
                                    </div>
                                    <div className="screen-size-contianer">
                                        <div className="screen-width">
                                            <label>W</label>
                                            {selectedOption === item.id ? (
                                                <input
                                                    type="number"
                                                    value={editWidth}
                                                    onChange={handleEditWidth}
                                                />
                                            ) : (
                                                <input
                                                    type="number"
                                                    value={Number(item.width)}
                                                    readOnly
                                                />
                                            )}
                                        </div>
                                        <div className="screen-height">
                                            <label>H</label>
                                            {selectedOption === item.id ? (
                                                <input
                                                    type="number"
                                                    value={editHeight}
                                                    onChange={handleEditHeight}
                                                />
                                            ) : (
                                                <input
                                                    type="number"
                                                    value={Number(item.heigth)}
                                                    readOnly
                                                />
                                            )}
                                        </div>
                                    </div>
                                    {selectedOption === item.id ? (
                                        <div className="screen-size-actions">
                                            <div
                                                className="screen-size-save"
                                                onClick={() => handleSave(item)}
                                            >
                                                save
                                            </div>
                                            <div
                                                className="screen-size-cancel"
                                                onClick={handleCancel}
                                            >
                                                cancel
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="screen-size-actions">
                                            <div
                                                className="screen-size-edit"
                                                onClick={() =>
                                                    handleStartEdit(item)
                                                }
                                            >
                                                edit
                                            </div>
                                            <div
                                                className="screen-size-btn -size-delete"
                                                onClick={() =>
                                                    handleDeleteScreenSize(
                                                        item.id,
                                                    )
                                                }
                                            >
                                                delete
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}

                        {showScreenPrompt && (
                            <div className="setting-option-container">
                                <div className="screen-heading-wrapper">
                                    <input
                                        className="screen-heading"
                                        placeholder="Enter value..."
                                        value={newName}
                                        onChange={(e) => handleNewName(e)}
                                    />
                                </div>
                                <div className="screen-size-contianer">
                                    <div className="screen-width">
                                        <label>W</label>
                                        <input
                                            type="number"
                                            placeholder="width"
                                            value={newWidth}
                                            onChange={(e) => handleNewWidth(e)}
                                        />
                                    </div>
                                    <div className="screen-height">
                                        <label>H</label>
                                        <input
                                            type="number"
                                            value={newHeight}
                                            placeholder="height"
                                            onChange={(e) => handleNewHeight(e)}
                                        />
                                    </div>
                                </div>

                                <div
                                    className="screen-size-save edit"
                                    onClick={handleNewScreenSize}
                                >
                                    save
                                </div>
                            </div>
                        )}

                        <div
                            className="add-option"
                            onClick={() =>
                                setShowScreenPrompt(!showScreenPrompt)
                            }
                        >
                            {showScreenPrompt ? "cancel" : "add"}
                        </div>
                    </div>
                </div>
            )}
            <div
                className="screen-settings"
                onClick={() => setShowScreenSetting(!showScreenSetting)}
            >
                <div
                    className={`seetings-btn ${showScreenSetting ? "active" : ""}`}
                >
                    <Settings size={screenIconsSize} />
                </div>
            </div>
        </div>
    );
};
