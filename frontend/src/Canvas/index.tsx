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

                    <div className="box-model-container">
                        <div className="heading">box model</div>
                        <div className="box-model">
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
        </div>
    );
};
