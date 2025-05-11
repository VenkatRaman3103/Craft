import React, { useState, useRef, useEffect } from "react";
import "./index.scss";
import { ElementPicker } from "./ElementPicker";
import { elementType } from "@/Types/canvas/elementsType";
import { PublishFeature } from "./PublishFeature";
import {
    AlignCenterHorizontal,
    AlignCenterVertical,
    AlignEndHorizontal,
    AlignEndVertical,
    AlignStartHorizontal,
    AlignStartVertical,
    AlignVerticalJustifyEnd,
    AlignVerticalJustifyStart,
    ArrowDown,
    ArrowLeft,
    ArrowUp,
} from "lucide-react";

type CanvasElement = {
    id: number;
    type: elementType;
    x: number;
    y: number;
    width: number;
    height: number;
    text: string;
    color: string;
};

export const Canvas: React.FC = () => {
    const [elements, setElements] = useState<CanvasElement[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    // dimensions
    const [elementHeight, setElementHeight] = useState(100);
    const [elementWidth, setElementWidth] = useState(100);

    const [dragging, setDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    const canvasRef = useRef<HTMLDivElement | null>(null);

    const addElement = (type: CanvasElement["type"]) => {
        const newElement: CanvasElement = {
            id: Date.now(),
            type,
            x: 100,
            y: 100,
            width: elementWidth,
            height: elementHeight,
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
            const x = e.clientX - canvasRect.left - dragOffset.x;
            const y = e.clientY - canvasRect.top - dragOffset.y;

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

    return (
        <div className="figma-container">
            <div
                className="canvas-container"
                ref={canvasRef}
                onMouseMove={handleMouseMove}
                onClick={handleCanvasClick}
            >
                <div className="canvas" style={{ position: "relative" }}>
                    {elements.map(renderElement)}
                </div>
            </div>

            <div className="status-bar-container">
                <div className="selected-item-info">
                    {selectedId
                        ? `Selected element ID: ${selectedId}`
                        : "Click to select an element. Drag to move."}
                </div>

                <div className="publish-container">
                    <PublishFeature
                        elements={elements}
                        elementWidth={elementWidth}
                        elementHeight={elementHeight}
                    />
                </div>

                <button
                    className="delete-button"
                    onClick={deleteSelected}
                    disabled={selectedId === null}
                >
                    Delete
                </button>
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
                </div>
            </div>
        </div>
    );
};

export default function AlignmentControlPanel() {
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
}

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
