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
    AlignCenter,
    AlignCenterHorizontal,
    AlignCenterVertical,
    AlignEndHorizontal,
    AlignEndVertical,
    AlignHorizontalSpaceAround,
    AlignHorizontalSpaceAroundIcon,
    AlignHorizontalSpaceBetween,
    AlignLeft,
    AlignRight,
    AlignStartHorizontal,
    AlignStartVertical,
    AlignVerticalJustifyCenter,
    AlignVerticalSpaceAroundIcon,
    ArrowLeft,
    ArrowUp,
    Bold,
    Italic,
    Monitor,
    RotateCcw,
    Settings,
    Smartphone,
    Tablet,
    Type,
    Underline,
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
    const [activeAction, setActiveAction] = useState<Actions>("moving");

    // grouping
    const [selectedElements, setSelectedElements] = useState<string[]>([]);
    const [toggleGrouping, setToggleGrouping] = useState(false);

    const [elements, setElements] = useState<CanvasElement[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [screen, setScreen] = useState<"mobile" | "desktop" | "tablet">(
        "desktop",
    );

    // dimensions
    const [elementHeight, setElementHeight] = useState(100);
    const [elementWidth, setElementWidth] = useState(100);

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

    const [dragging, setDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    const canvasRef = useRef<HTMLDivElement | null>(null);

    // zoom in and out
    const [zoomLevel, setZoomLevel] = useState(1);
    const maxZoomLevel = 3;
    const minZoomLevel = 0.3;
    const zoomStepper = 0.1;

    const addElement = (type: CanvasElement["type"]) => {
        const newElement: CanvasElement = {
            id: Date.now(),
            type,
            x: 100,
            y: 100,
            width: elementWidth,
            height: elementHeight,
            "border-radius": elementRadius,
            text: type === "text" ? "Text element" : "",
            color: getRandomColor(),
            "border-style": borderStyle,
            children: [],
            isGroup: false,
            groupLevel: 0,
        };
        setElements((prev) => [...prev, newElement]);
        setSelectedId(newElement.id);
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

    const handleMouseDown = (
        e: React.MouseEvent<HTMLDivElement>,
        id: number,
    ) => {
        if (toggleGrouping) {
            handleSelementElements(id.toString());
            return;
        }

        if (id !== selectedId) {
            setSelectedId(id);
        }

        const element = elements.find((el) => el.id === id);
        if (element && canvasRef.current) {
            const canvasRect = canvasRef.current.getBoundingClientRect();
            const offsetX =
                (e.clientX - canvasRect.left) / zoomLevel - element.x;
            const offsetY =
                (e.clientY - canvasRect.top) / zoomLevel - element.y;
            setDragOffset({ x: offsetX, y: offsetY });
            setDragging(true);
        }
        e.stopPropagation();
    };

    const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === canvasRef.current) {
            setSelectedId(null);
            if (toggleGrouping && selectedElements.length > 1) {
                createGroup();
            }
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (dragging && selectedId !== null && canvasRef.current) {
            const canvasRect = canvasRef.current.getBoundingClientRect();
            const x = (e.clientX - canvasRect.left) / zoomLevel - dragOffset.x;
            const y = (e.clientY - canvasRect.top) / zoomLevel - dragOffset.y;

            setElements((prev) =>
                prev.map((el) => (el.id === selectedId ? { ...el, x, y } : el)),
            );
        }
    };

    const handleMouseUp = () => {
        setDragging(false);
    };

    const deleteSelected = () => {
        if (selectedId !== null) {
            setElements((prev) => prev.filter((el) => el.id !== selectedId));
            setSelectedId(null);
        }
    };

    function handleSelementElements(elementId: string) {
        const numericId = parseInt(elementId);

        if (!selectedElements.includes(elementId)) {
            setSelectedElements([...selectedElements, elementId]);
        } else {
            setSelectedElements(
                selectedElements.filter((id) => id !== elementId),
            );
        }
    }

    const createGroup = () => {
        if (selectedElements.length < 2) return;

        const selectedElementIds = selectedElements.map((id) => parseInt(id));
        const elementsToGroup = elements.filter((el) =>
            selectedElementIds.includes(el.id),
        );

        if (elementsToGroup.length < 2) return;

        const getAllBounds = (element) => {
            if (element.isGroup && element.children) {
                const childBounds = element.children.map((child) => ({
                    minX: element.x + child.x,
                    minY: element.y + child.y,
                    maxX: element.x + child.x + child.width,
                    maxY: element.y + child.y + child.height,
                }));

                return {
                    minX: Math.min(...childBounds.map((b) => b.minX)),
                    minY: Math.min(...childBounds.map((b) => b.minY)),
                    maxX: Math.max(...childBounds.map((b) => b.maxX)),
                    maxY: Math.max(...childBounds.map((b) => b.maxY)),
                };
            } else {
                return {
                    minX: element.x,
                    minY: element.y,
                    maxX: element.x + element.width,
                    maxY: element.y + element.height,
                };
            }
        };

        const allBounds = elementsToGroup.map(getAllBounds);
        const minX = Math.min(...allBounds.map((b) => b.minX));
        const minY = Math.min(...allBounds.map((b) => b.minY));
        const maxX = Math.max(...allBounds.map((b) => b.maxX));
        const maxY = Math.max(...allBounds.map((b) => b.maxY));

        const groupElement: CanvasElement = {
            id: Date.now(),
            type: "div",
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY,
            "border-radius": 0,
            text: "",
            color: "transparent",
            "border-style": "dashed",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            flexDirection: "row",
            isReversed: false,
            gap: 0,
            children: elementsToGroup.map((el) => {
                if (el.isGroup && el.children) {
                    return {
                        ...el,
                        x: el.x - minX,
                        y: el.y - minY,
                        children: el.children,
                    };
                } else {
                    return {
                        ...el,
                        x: el.x - minX,
                        y: el.y - minY,
                    };
                }
            }),
            isGroup: true,
            groupLevel:
                Math.max(...elementsToGroup.map((el) => el.groupLevel || 0)) +
                1,
        };

        setElements((prev) => [
            ...prev.filter((el) => !selectedElementIds.includes(el.id)),
            groupElement,
        ]);

        setSelectedElements([]);
        setToggleGrouping(false);
        setActiveAction("moving");
        setSelectedId(groupElement.id);
    };

    const ungroupSelected = () => {
        if (selectedId === null) return;

        const element = elements.find((el) => el.id === selectedId);
        if (!element || !element.isGroup || !element.children) return;

        const ungroupedElements = element.children.map((child) => ({
            ...child,
            id: child.id || Date.now() + Math.random(),
            x: child.x + element.x,
            y: child.y + element.y,
        }));

        setElements((prev) => [
            ...prev.filter((el) => el.id !== selectedId),
            ...ungroupedElements,
        ]);

        setSelectedId(null);
    };

    useEffect(() => {
        document.addEventListener("mouseup", handleMouseUp);
        return () => {
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, []);

    const renderElement = (element) => {
        const isSelected = element.id === selectedId;
        const isSelectedForGrouping = selectedElements.includes(
            element.id.toString(),
        );

        const elementClassNames = `canvas-element ${isSelected ? "selected" : ""} ${isSelectedForGrouping ? "selected-for-grouping" : ""}`;

        const getElementFlexDirection = () => {
            const baseDirection = element.flexDirection || "row";
            const reversed = element.isReversed || false;

            if (reversed) {
                return baseDirection === "row"
                    ? "row-reverse"
                    : "column-reverse";
            }
            return baseDirection;
        };

        const elementStyle: React.CSSProperties = {
            left: `${element.x}px`,
            top: `${element.y}px`,
            width: `${element.isGroup ? element.width : elementWidth}px`,
            height: `${element.isGroup ? element.height : elementHeight}px`,
            backgroundColor: element.color,
            borderRadius: `${elementRadius}px`,
            borderTopLeftRadius: `${topLeftRadius}px`,
            borderTopRightRadius: `${topRightRadius}px`,
            borderBottomLeftRadius: `${bottomLeftRadius}px`,
            borderBottomRightRadius: `${bottomRightRadius}px`,
            borderStyle: element.isGroup ? "dashed" : borderStyle,
            borderWidth: `${elementBoderWidth}px`,
            borderLeftWidth: `${leftWidth}px`,
            borderRightWidth: `${rightWidth}px`,
            borderTopWidth: `${topWidth}px`,
            borderBottomWidth: `${bottomWidth}px`,
            borderColor: element.isGroup ? "#007AFF" : "inherit",
            position: "absolute",
            display: element.isGroup ? "flex" : "block",
            alignItems: element.isGroup
                ? element.alignItems || "flex-start"
                : undefined,
            justifyContent: element.isGroup
                ? element.justifyContent || "flex-start"
                : undefined,
            flexDirection: element.isGroup
                ? getElementFlexDirection()
                : undefined,
            gap: element.isGroup ? `${element.gap || 0}px` : undefined,
        };

        const renderNestedElement = (child, depth = 0) => {
            if (child.isGroup && child.children) {
                const nestedGroupStyle: React.CSSProperties = {
                    position: "relative",
                    width: `${child.width}px`,
                    height: `${child.height}px`,
                    borderStyle: "dashed",
                    borderWidth: "1px",
                    borderColor: depth === 0 ? "#FF6B35" : "#28A745",
                    backgroundColor: "transparent",
                    display: "flex",
                    alignItems: child.alignItems || "flex-start",
                    justifyContent: child.justifyContent || "flex-start",
                    flexDirection: child.isReversed
                        ? child.flexDirection === "row"
                            ? "row-reverse"
                            : "column-reverse"
                        : child.flexDirection || "row",
                    gap: `${child.gap || 0}px`,
                    flexShrink: 0,
                };

                return (
                    <div key={child.id} style={nestedGroupStyle}>
                        {child.children.map((nestedChild) =>
                            renderNestedElement(nestedChild, depth + 1),
                        )}
                        <div
                            style={{
                                position: "absolute",
                                top: `${-15 - depth * 15}px`,
                                left: "0",
                                fontSize: "10px",
                                color: depth === 0 ? "#FF6B35" : "#28A745",
                                fontWeight: "bold",
                                whiteSpace: "nowrap",
                                zIndex: 1000,
                            }}
                        >
                            Group L{depth + 1}
                        </div>
                    </div>
                );
            } else {
                const childStyle: React.CSSProperties = {
                    position: "relative",
                    width: `${child.width}px`,
                    height: `${child.height}px`,
                    backgroundColor: child.color,
                    borderRadius: `${child["border-radius"]}px`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    flexShrink: 0,
                };

                return (
                    <div key={child.id} style={childStyle}>
                        {child.type === "text" ? child.text : child.type}
                    </div>
                );
            }
        };

        return (
            <div
                key={element.id}
                className={elementClassNames}
                style={elementStyle}
                onMouseDown={(e) => handleMouseDown(e, element.id)}
            >
                {element.isGroup ? (
                    <>
                        {element.children?.map((child) =>
                            renderNestedElement(child),
                        )}
                        <div
                            style={{
                                position: "absolute",
                                top: "-20px",
                                left: "0",
                                fontSize: "12px",
                                color: "#007AFF",
                                fontWeight: "bold",
                                zIndex: 1000,
                            }}
                        >
                            Main Group
                        </div>
                    </>
                ) : (
                    <>
                        {element.type === "text" ? (
                            element.text
                        ) : element.type === "div" ? (
                            <div className="element-content rectangle">div</div>
                        ) : (
                            <div className="element-content circle">circle</div>
                        )}
                    </>
                )}
            </div>
        );
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

    console.log(selectedElements, "selectedElements");

    return (
        <div className="figma-container">
            <div
                className="canvas-container"
                ref={canvasRef}
                onMouseMove={handleMouseMove}
                onClick={handleCanvasClick}
            >
                <div className={`canvas ${screen}`} style={canvasStyle}>
                    {elements.map(renderElement)}
                </div>
            </div>

            <div className="status-bar-container">
                <div className="selected-item-info">
                    {toggleGrouping && selectedElements.length > 0
                        ? `${selectedElements.length} elements selected for grouping`
                        : selectedId
                          ? `Selected element ID: ${selectedId}`
                          : "Click to select an element. Drag to move."}
                </div>

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
                        elements={elements}
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
                selectedElements={selectedElements}
                setSelectedElements={setSelectedElements}
                selectedId={selectedId}
                toggleGrouping={toggleGrouping}
                setToggleGrouping={setToggleGrouping}
                createGroup={createGroup}
            />

            <div className="toolbar-container">
                <div className="toolbar">
                    <div className="toolbar-header toolbar-section">
                        {selectedId
                            ? elements.find((el) => el.id === selectedId)
                                  ?.isGroup && (
                                  <button
                                      className="ungroup-button header-button"
                                      onClick={ungroupSelected}
                                  >
                                      Ungroup
                                  </button>
                              )
                            : ""}
                        <button
                            className="delete-button header-button"
                            onClick={deleteSelected}
                            disabled={selectedId === null}
                        >
                            Delete
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
                    <AlignmentControlPanel
                        selectedId={selectedId}
                        elements={elements}
                        setElements={setElements}
                    />
                    <BorderControlPanel
                        toggleAllSide_radius={toggleAllSide_radius}
                        toggleAllSide_width={toggleAllSide_width}
                        setToggleAllSide_radius={setToggleAllSide_radius}
                        setToggleAllSide_width={setToggleAllSide_width}
                    />
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

                <div
                    className="preview-wrapper"
                    style={{
                        display: type === "flex" ? "flex" : "grid",
                        flexDirection:
                            type === "flex" ? getFlexDirection() : undefined,
                        gridTemplateColumns:
                            type === "grid" ? "1fr 1fr 1fr" : undefined,
                        gap: `${gap}px`,
                        justifyContent:
                            type === "flex" ? justifyContent : undefined,
                        alignItems: type === "flex" ? alignItems : undefined,
                        alignContent: type === "grid" ? alignItems : undefined,
                        placeItems: type === "grid" ? alignItems : undefined,
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
                            <AlignEndHorizontal size={20} strokeWidth={1.25} />
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
            </div>
        </div>
    );
};

export const FontsControlPanel = () => {
    const [activeDecoration, setActiveDecoration] = useState("bold");
    const [activeAlignType, setActiveAlignType] = useState("left-align");
    const fontIconSize = 16;
    return (
        <div className="fonts-section-container toolbar-section">
            <div className="heading">font</div>
            <div className="font-sizing-sub-section">
                <div className="font-sizing-section">
                    <div className="heading">font</div>
                    <div className="font-sizing-tools-container">
                        <select className="font-style-select select-drop-down">
                            <option>option 1</option>
                            <option>option 2</option>
                            <option>option 3</option>
                        </select>
                        <select className="font-width-select select-drop-down">
                            <option>option 1</option>
                            <option>option 2</option>
                            <option>option 3</option>
                        </select>
                        <div className="font-decoration-tools">
                            <div className="font-size font-tool">
                                <Type size={fontIconSize} />
                                <input type="number" />
                            </div>
                            <div className="font-decoration-options">
                                <div
                                    className={`font-bold decoration-tool ${activeDecoration == "bold" ? "active" : ""}`}
                                    onClick={() => setActiveDecoration("bold")}
                                >
                                    <Bold size={fontIconSize} />
                                </div>
                                <div
                                    className={`font-italic decoration-tool ${activeDecoration == "italic" ? "active" : ""}`}
                                    onClick={() =>
                                        setActiveDecoration("italic")
                                    }
                                >
                                    <Italic size={fontIconSize} />
                                </div>
                                <div
                                    className={`font-underline decoration-tool ${activeDecoration == "underline" ? "active" : ""}`}
                                    onClick={() =>
                                        setActiveDecoration("underline")
                                    }
                                >
                                    <Underline size={fontIconSize} />
                                </div>
                            </div>
                        </div>
                        <div className="font-spacing-tools">
                            <div className="font-top-bottom-space font-space font-tool">
                                <AlignVerticalSpaceAroundIcon
                                    size={fontIconSize}
                                />
                                <input type="number" />
                            </div>
                            <div className="font-left-bottom-space font-space font-tool">
                                <AlignHorizontalSpaceAroundIcon
                                    size={fontIconSize}
                                />
                                <input type="number" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="font-align-section">
                    <div className="heading">align</div>
                    <div className="font-align-tools-container">
                        <div className="font-align-tools">
                            <div className="font-align-decoration-options">
                                <div
                                    className={`left-align-tool align-tool ${activeAlignType == "left-align" ? "active" : ""}`}
                                    onClick={() =>
                                        setActiveAlignType("left-align")
                                    }
                                >
                                    <AlignLeft size={fontIconSize} />
                                </div>
                                <div
                                    className={`centre-align-tool align-tool ${activeAlignType == "centre-align" ? "active" : ""}`}
                                    onClick={() =>
                                        setActiveAlignType("centre-align")
                                    }
                                >
                                    <AlignCenter size={fontIconSize} />
                                </div>
                                <div
                                    className={`right-align-tool align-tool ${activeAlignType == "right-align" ? "active" : ""}`}
                                    onClick={() =>
                                        setActiveAlignType("right-align")
                                    }
                                >
                                    <AlignRight size={fontIconSize} />
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
