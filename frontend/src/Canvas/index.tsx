import React, { useState, useRef, useEffect } from "react";
import "./index.scss";

type CanvasElement = {
    id: number;
    type: "rectangle" | "circle" | "text" | "image" | "text_input";
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
    const [dragging, setDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    const canvasRef = useRef<HTMLDivElement | null>(null);

    const addElement = (type: CanvasElement["type"]) => {
        const newElement: CanvasElement = {
            id: Date.now(),
            type,
            x: 100,
            y: 100,
            width: 100,
            height: 100,
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

    const renderElement = (element: CanvasElement) => {
        const isSelected = element.id === selectedId;

        const elementClassNames = `canvas-element ${isSelected ? "selected" : ""}`;
        const elementStyle: React.CSSProperties = {
            left: `${element.x}px`,
            top: `${element.y}px`,
            width: `${element.width}px`,
            height: `${element.height}px`,
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
                ) : element.type === "image" ? (
                    <div>Image</div>
                ) : element.type === "rectangle" ? (
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
                    some
                    {elements.map(renderElement)}
                </div>
            </div>

            <div className="status-bar-container">
                <div className="selected-item-info">
                    {selectedId
                        ? `Selected element ID: ${selectedId}`
                        : "Click to select an element. Drag to move."}
                </div>

                <button
                    className="delete-button"
                    onClick={deleteSelected}
                    disabled={selectedId === null}
                >
                    Delete
                </button>
            </div>

            <div className="toolbar-container">
                <div className="toolbar">
                    <div className="elements-container">
                        <div className="heading">general elements</div>
                        <div className="elements">
                            <button
                                className="tool-button"
                                onClick={() => addElement("rectangle")}
                            >
                                Rectangle
                            </button>
                            <button
                                className="tool-button"
                                onClick={() => addElement("circle")}
                            >
                                Circle
                            </button>
                            <button
                                className="tool-button"
                                onClick={() => addElement("text")}
                            >
                                Text
                            </button>
                            <button
                                className="tool-button"
                                onClick={() => addElement("image")}
                            >
                                Image
                            </button>
                        </div>
                    </div>

                    <div className="elements-container">
                        <div className="heading">input elements</div>
                        <div className="elements">
                            <button
                                className="tool-button"
                                onClick={() => addElement("text_input")}
                            >
                                text
                            </button>
                        </div>
                    </div>

                    <AlignmentControlPanel />
                    <div className="box-model-container">
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
        <div className="alignment-container">
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

                        <div className="reverse-selection">
                            <input
                                type="checkbox"
                                id="reverse"
                                checked={reverse}
                                onChange={() => setReverse(!reverse)}
                            />
                            <label htmlFor="reverse">reverse</label>
                        </div>
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
                            Start
                        </button>
                        <button
                            className={`center-option ${justifyContent === "center" ? "active" : ""}`}
                            onClick={() => setJustifyContent("center")}
                        >
                            Center
                        </button>
                        <button
                            className={`end-option ${justifyContent === "flex-end" ? "active" : ""}`}
                            onClick={() => setJustifyContent("flex-end")}
                        >
                            End
                        </button>
                    </div>
                </div>

                <div className="ai-wrapper">
                    <div className="ai-options">
                        <button
                            className={`start-option ${alignItems === "flex-start" ? "active" : ""}`}
                            onClick={() => setAlignItems("flex-start")}
                        >
                            Start
                        </button>
                        <button
                            className={`center-option ${alignItems === "center" ? "active" : ""}`}
                            onClick={() => setAlignItems("center")}
                        >
                            Center
                        </button>
                        <button
                            className={`end-option ${alignItems === "flex-end" ? "active" : ""}`}
                            onClick={() => setAlignItems("flex-end")}
                        >
                            End
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
