import React, { useState, useRef, useEffect } from "react";
import "./index.scss";
import { ElementPicker, iconStrockWidth } from "./ElementPicker";
import { elementType } from "@/Types/canvas/elementsType";
import { PublishFeature } from "./PublishFeature";
import {
    AlignCenter,
    AlignCenterHorizontal,
    AlignCenterVertical,
    AlignEndHorizontal,
    AlignEndVertical,
    AlignHorizontalSpaceAround,
    AlignHorizontalSpaceAroundIcon,
    AlignLeft,
    AlignRight,
    AlignStartHorizontal,
    AlignStartVertical,
    AlignVerticalJustifyEnd,
    AlignVerticalJustifyStart,
    AlignVerticalSpaceAround,
    AlignVerticalSpaceAroundIcon,
    ArrowDown,
    ArrowLeft,
    ArrowUp,
    Bold,
    Italic,
    Minus,
    Monitor,
    RotateCcw,
    Scan,
    Settings,
    Smartphone,
    Square,
    SquareDashed,
    SquareDashedTopSolid,
    SquareRoundCorner,
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
};

export const Canvas: React.FC = () => {
    const [elements, setElements] = useState<CanvasElement[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [screen, setScreen] = useState<"mobile" | "desktop" | "tablet">(
        "desktop",
    );

    // dimensions
    const [elementHeight, setElementHeight] = useState(100);
    const [elementWidth, setElementWidth] = useState(100);

    // border
    const [elementRadius, setElementRadius] = useState(0);

    const [topLeftRadius, setTopLeftRadius] = useState(0);
    const [topRightRadius, setTopRightRadius] = useState(0);
    const [bottomRightRadius, setBottomRightRadius] = useState(0);
    const [bottomLeftRadius, setBottomLeftRadius] = useState(0);

    const [toggleAllSide_radius, setToggleAllSide_radius] = useState<
        "all" | "specific"
    >("all");

    const [dragging, setDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    const canvasRef = useRef<HTMLDivElement | null>(null);

    // zoome in and out
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
        if (id !== selectedId) {
            setSelectedId(id);
        }

        const element = elements.find((el) => el.id === id);
        if (element && canvasRef.current) {
            const canvasRect = canvasRef.current.getBoundingClientRect();
            const offsetX = e.clientX - canvasRect.left - element.x;
            const offsetY = e.clientY - canvasRect.top - element.y;
            setDragOffset({ x: offsetX, y: offsetY });
            setDragging(true);
        }

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

    useEffect(() => {
        document.addEventListener("mouseup", handleMouseUp);
        return () => {
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, []);

    const renderElement = (element) => {
        const isSelected = element.id === selectedId;

        const elementClassNames = `canvas-element ${isSelected ? "selected" : ""}`;
        const elementStyle: React.CSSProperties = {
            left: `${element.x}px`,
            top: `${element.y}px`,
            width: `${elementWidth}px`,
            height: `${elementHeight}px`,
            backgroundColor: element.color,
            borderRadius: `${elementRadius}px`,
            borderTopLeftRadius: `${topLeftRadius}px`,
            borderTopRightRadius: `${topRightRadius}px`,
            borderBottomLeftRadius: `${bottomLeftRadius}px`,
            borderBottomRightRadius: `${bottomRightRadius}px`,
            position: "absolute",
        };

        return (
            <div
                key={element.id}
                className={elementClassNames}
                style={elementStyle}
                onMouseDown={(e) => handleMouseDown(e, element.id)}
            >
                {element.type === "text" ? (
                    element.text
                ) : element.type === "div" ? (
                    <div className="element-content rectangle"></div>
                ) : (
                    <div className="element-content circle"></div>
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
                {/* <div className="selected-item-info"> */}
                {/*     {selectedId */}
                {/*         ? `Selected element ID: ${selectedId}` */}
                {/*         : "Click to select an element. Drag to move."} */}
                {/* </div> */}

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
                    />
                </div>
            </div>

            <ElementPicker addElement={addElement} />

            <div className="toolbar-container">
                <div className="toolbar">
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
                    <FontsControlPanel />
                    <BorderControlPanel
                        elementRadius={elementRadius}
                        setElementRadius={setElementRadius}
                        toggleAllSide_radius={toggleAllSide_radius}
                        setToggleAllSide_radius={setToggleAllSide_radius}
                        topLeftRadius={topLeftRadius}
                        setTopLeftRadius={setTopLeftRadius}
                        topRightRadius={topRightRadius}
                        setTopRightRadius={setTopRightRadius}
                        bottomRightRadius={bottomRightRadius}
                        setBottomRightRadius={setBottomRightRadius}
                        bottomLeftRadius={bottomLeftRadius}
                        setBottomLeftRadius={setBottomLeftRadius}
                    />
                    <AlignmentControlPanel />
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

                    <button
                        className="delete-button"
                        onClick={deleteSelected}
                        disabled={selectedId === null}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export const BorderControlPanel = ({
    elementRadius,
    setElementRadius,
    toggleAllSide_radius,
    setToggleAllSide_radius,
    topLeftRadius,
    setTopLeftRadius,
    topRightRadius,
    setTopRightRadius,
    bottomRightRadius,
    setBottomRightRadius,
    bottomLeftRadius,
    setBottomLeftRadius,
}: any) => {
    const [activeSide_width, setActiveSide_width] = useState<
        "all" | "specific"
    >("all");

    const borderIconSize = 16;

    function handleBorderRadius(event) {
        event.preventDefault();
        setElementRadius(event.target.value);
    }

    useEffect(() => {
        if (toggleAllSide_radius == "specific") {
            setElementRadius(0);
        } else {
            setTopLeftRadius(0);
            setTopRightRadius(0);
            setBottomRightRadius(0);
            setBottomLeftRadius(0);
        }
    }, [toggleAllSide_radius]);

    return (
        <div className="border-section-container toolbar-section">
            <div className="heading">border</div>
            <div className="border-tools-container">
                <div className="border-width-sub-section">
                    <div className="sub-heading">width</div>
                    <div className="border-width-tools-container">
                        <div className="boder-width-adjustments-container">
                            <div className="boder-width-adjustments">
                                <div className="border-width border-tool">
                                    <div className="border-width-icon">
                                        <Minus size={borderIconSize} />
                                    </div>
                                    <input type="number" />
                                </div>
                            </div>
                            <div className="boder-width-sides-toggle">
                                <div
                                    className={`all-sides ${activeSide_width == "all" ? "active" : ""}`}
                                    onClick={() => setActiveSide_width("all")}
                                >
                                    <Square size={borderIconSize} />
                                </div>
                                <div
                                    className={`target-sides ${activeSide_width == "specific" ? "active" : ""}`}
                                    onClick={() =>
                                        setActiveSide_width("specific")
                                    }
                                >
                                    <SquareDashed size={borderIconSize} />
                                </div>
                            </div>
                        </div>
                        <div className="boder-width-specific-sides-selection">
                            <div className="top-side-wrapper border-sides border-tool">
                                <div className="top-border-wraper">
                                    <SquareDashedTopSolid
                                        className="top-border"
                                        size={borderIconSize}
                                    />
                                </div>
                                <input type="number" />
                            </div>
                            <div className="bottom-side-wrapper border-sides border-tool">
                                <div className="bottom-border-wraper">
                                    <SquareDashedTopSolid
                                        className="bottom-border"
                                        size={borderIconSize}
                                    />
                                </div>
                                <input type="number" />
                            </div>
                            <div className="left-side-wrapper border-sides border-tool">
                                <div className="left-border-wraper">
                                    <SquareDashedTopSolid
                                        className="left-border"
                                        size={borderIconSize}
                                    />
                                </div>
                                <input type="number" />
                            </div>
                            <div className="right-side-wrapper border-sides border-tool">
                                <div className="right-border-wraper">
                                    <SquareDashedTopSolid
                                        className="right-border"
                                        size={borderIconSize}
                                    />
                                </div>
                                <input type="number" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-width-sub-section">
                    <div className="sub-heading">Style</div>
                    <div className="border-width-tools-container">
                        <select className="select-drop-down">
                            <option>line</option>
                            <option>dashed</option>
                            <option>dotted</option>
                        </select>
                    </div>
                </div>

                <div className="border-radius-sub-section">
                    <div className="sub-heading">radius</div>
                    <div className="border-radius-tools-container">
                        <div className="boder-radius-adjustments-container">
                            <div className="boder-radius-adjustments">
                                <div className="border-radius border-tool">
                                    <div className="border-radius-icon">
                                        <SquareRoundCorner
                                            size={borderIconSize}
                                        />
                                    </div>
                                    <input
                                        type="number"
                                        onChange={(e) => handleBorderRadius(e)}
                                        value={elementRadius}
                                    />
                                </div>
                            </div>
                            <div className="boder-radius-sides-toggle">
                                <div
                                    className={`all-sides ${toggleAllSide_radius == "all" ? "active" : ""}`}
                                    onClick={() =>
                                        setToggleAllSide_radius("all")
                                    }
                                >
                                    <Square size={borderIconSize} />
                                </div>
                                <div
                                    className={`target-sides ${toggleAllSide_radius == "specific" ? "active" : ""}`}
                                    onClick={() =>
                                        setToggleAllSide_radius("specific")
                                    }
                                >
                                    <Scan size={borderIconSize} />
                                </div>
                            </div>
                        </div>
                        {toggleAllSide_radius == "specific" && (
                            <div className="boder-radius-specific-sides-selection">
                                <div className="top-side-wrapper border-sides border-tool">
                                    <div className="top-border-wraper">
                                        <SquareRoundCorner
                                            className="top-border"
                                            size={borderIconSize}
                                        />
                                    </div>
                                    <input
                                        type="number"
                                        value={topLeftRadius}
                                        onChange={(e) =>
                                            setTopLeftRadius(e.target.value)
                                        }
                                    />
                                </div>
                                <div className="bottom-side-wrapper border-sides border-tool">
                                    <div className="bottom-border-wraper">
                                        <SquareRoundCorner
                                            className="bottom-border"
                                            size={borderIconSize}
                                        />
                                    </div>
                                    <input
                                        type="number"
                                        value={topRightRadius}
                                        onChange={(e) =>
                                            setTopRightRadius(e.target.value)
                                        }
                                    />
                                </div>
                                <div className="left-side-wrapper border-sides border-tool">
                                    <div className="left-border-wraper">
                                        <SquareRoundCorner
                                            className="left-border"
                                            size={borderIconSize}
                                        />
                                    </div>
                                    <input
                                        type="number"
                                        value={bottomLeftRadius}
                                        onChange={(e) =>
                                            setBottomLeftRadius(e.target.value)
                                        }
                                    />
                                </div>
                                <div className="right-side-wrapper border-sides border-tool">
                                    <div className="right-border-wraper">
                                        <SquareRoundCorner
                                            className="right-border"
                                            size={borderIconSize}
                                        />
                                    </div>
                                    <input
                                        type="number"
                                        value={bottomRightRadius}
                                        onChange={(e) =>
                                            setBottomRightRadius(e.target.value)
                                        }
                                    />
                                </div>
                            </div>
                        )}
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

export const AlignmentControlPanel = () => {
    const [layoutType, setLayoutType] = useState("flex");
    const [direction, setDirection] = useState("row");
    const [reverse, setReverse] = useState(false);
    const [gap, setGap] = useState(10);
    const [justifyContent, setJustifyContent] = useState("flex-start");
    const [alignItems, setAlignItems] = useState("flex-start");

    const getFlexDirection = () => {
        if (direction === "row") {
            return reverse ? "row-reverse" : "row";
        } else {
            return reverse ? "column-reverse" : "column";
        }
    };

    const boxStyle = {
        width: "50px",
        height: "50px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: "1px solid #ccc",
        margin: "5px",
    };

    return (
        <div className="alignment-container  toolbar-section">
            <div className="heading">Alignment</div>
            <select
                className="alignment-select"
                value={layoutType}
                onChange={(e) => setLayoutType(e.target.value)}
            >
                <option value="flex">flex</option>
                <option value="grid">grid</option>
            </select>

            <div className="flex-alignment-preview">
                <div className="direction-wrapper">
                    <div className="direction-selector">
                        <button
                            className={`row ${direction === "row" ? "active" : ""}`}
                            onClick={() => setDirection("row")}
                        >
                            Row
                        </button>
                        <button
                            className={`column ${direction === "column" ? "active" : ""}`}
                            onClick={() => setDirection("column")}
                        >
                            Column
                        </button>
                    </div>

                    <button
                        onClick={() => setReverse(!reverse)}
                        className={`reverse-selection ${reverse ? "active" : ""}`}
                    >
                        {direction == "row" ? (
                            <ArrowLeft size={20} strokeWidth={1.25} />
                        ) : (
                            <ArrowUp size={20} strokeWidth={1.25} />
                        )}
                    </button>
                </div>

                <div className="gap-wrapper">
                    <div className="gap-icon">Gap:</div>
                    <div className="gap-value">
                        <input
                            type="range"
                            min="0"
                            max="50"
                            value={gap}
                            onChange={(e) => setGap(parseInt(e.target.value))}
                        />
                        <span>{gap}px</span>
                    </div>
                </div>

                <div
                    className="preiview-wrapper"
                    style={{
                        display: layoutType === "flex" ? "flex" : "grid",
                        flexDirection:
                            layoutType === "flex"
                                ? getFlexDirection()
                                : undefined,
                        gridTemplateColumns:
                            layoutType === "grid" ? "1fr 1fr 1fr" : undefined,
                        gap: `${gap}px`,
                        justifyContent,
                        alignItems:
                            layoutType === "flex" ? alignItems : undefined,
                        alignContent:
                            layoutType === "grid" ? alignItems : undefined,
                    }}
                >
                    <div className="box"></div>
                    <div className="box"></div>
                    <div className="box"></div>
                </div>

                <div className="jc-wrapper">
                    <div className="jc-options">
                        <button
                            className={`start-option ${justifyContent === "flex-start" ? "active" : ""}`}
                            onClick={() => setJustifyContent("flex-start")}
                        >
                            <AlignStartVertical size={20} strokeWidth={1.25} />
                        </button>
                        <button
                            className={`center-option ${justifyContent === "center" ? "active" : ""}`}
                            onClick={() => setJustifyContent("center")}
                        >
                            <AlignCenterVertical size={20} strokeWidth={1.25} />
                        </button>
                        <button
                            className={`end-option ${justifyContent === "flex-end" ? "active" : ""}`}
                            onClick={() => setJustifyContent("flex-end")}
                        >
                            <AlignEndVertical size={20} strokeWidth={1.25} />
                        </button>
                    </div>
                </div>

                <div className="ai-wrapper">
                    <div className="ai-options">
                        <button
                            className={`start-option ${alignItems === "flex-start" ? "active" : ""}`}
                            onClick={() => setAlignItems("flex-start")}
                        >
                            <AlignStartHorizontal
                                size={20}
                                strokeWidth={1.25}
                            />
                        </button>
                        <button
                            className={`center-option ${alignItems === "center" ? "active" : ""}`}
                            onClick={() => setAlignItems("center")}
                        >
                            <AlignCenterHorizontal
                                size={20}
                                strokeWidth={1.25}
                            />
                        </button>
                        <button
                            className={`end-option ${alignItems === "flex-end" ? "active" : ""}`}
                            onClick={() => setAlignItems("flex-end")}
                        >
                            <AlignEndHorizontal size={20} strokeWidth={1.25} />
                        </button>
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
