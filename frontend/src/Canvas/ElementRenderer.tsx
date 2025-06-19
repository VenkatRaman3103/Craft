import React, { useCallback } from "react";

interface ElementRendererProps {
    element: any;
    level?: number;
    isDragging: boolean;
    activeAction: "moving" | "scalling" | "grouping" | "grabbing";
    getElementStyle: (element: any) => React.CSSProperties;
    handleMouseDown: (
        e: React.MouseEvent,
        elementId: string | number,
        setSelectedId: (id: string | number | null) => void,
    ) => void;
    setSelectedId: (id: string | number | null) => void;
    renderElement?: (element: any, level?: number) => React.ReactElement;
}

export const ElementRenderer: React.FC<ElementRendererProps> = ({
    element,
    level = 0,
    isDragging,
    activeAction,
    getElementStyle,
    handleMouseDown,
    setSelectedId,
    renderElement,
}) => {
    const handleElementClick = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            if (!isDragging) {
                setSelectedId(element.id);
            }
        },
        [isDragging, element.id, setSelectedId],
    );

    const renderElementContent = useCallback(() => {
        console.log(element.type, "elementType");
        switch (element.type) {
            case "text":
                return (
                    <input
                        type="text"
                        placeholder={
                            element.attributes?.placeholder || "Enter text..."
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
                        }}
                    >
                        {element.content || "Enter H1"}
                    </h1>
                );

            case "h2":
                return (
                    <h2
                        style={{
                            border: "none",
                            background: "transparent",
                            outline: "none",
                            width: "auto",
                            height: "auto",
                            margin: 0,
                            padding: "8px",
                        }}
                    >
                        {element.content || "Enter H2"}
                    </h2>
                );

            case "h3":
                return (
                    <h3
                        style={{
                            border: "none",
                            background: "transparent",
                            outline: "none",
                            width: "auto",
                            height: "auto",
                            margin: 0,
                            padding: "8px",
                        }}
                    >
                        {element.content || "Enter H3"}
                    </h3>
                );

            case "span":
                return (
                    <span
                        style={{
                            border: "none",
                            background: "transparent",
                            outline: "none",
                            width: "auto",
                            height: "auto",
                            margin: 0,
                            padding: "8px",
                        }}
                    >
                        {element.content || "Enter span"}
                    </span>
                );

            case "strong":
                return (
                    <strong
                        style={{
                            border: "none",
                            background: "transparent",
                            outline: "none",
                            width: "auto",
                            height: "auto",
                            margin: 0,
                            padding: "8px",
                        }}
                    >
                        {element.content || "Enter strong"}
                    </strong>
                );

            case "em":
                return (
                    <em
                        style={{
                            border: "none",
                            background: "transparent",
                            outline: "none",
                            width: "auto",
                            height: "auto",
                            margin: 0,
                            padding: "8px",
                        }}
                    >
                        {element.content || "Enter em"}
                    </em>
                );

            case "blockquote":
                return (
                    <blockquote
                        style={{
                            border: "none",
                            background: "transparent",
                            outline: "none",
                            width: "auto",
                            height: "auto",
                            margin: 0,
                            padding: "8px",
                        }}
                    >
                        {element.content || "Enter blockquote"}
                    </blockquote>
                );

            case "code":
                return (
                    <code
                        style={{
                            border: "none",
                            background: "transparent",
                            outline: "none",
                            width: "auto",
                            height: "auto",
                            margin: 0,
                            padding: "8px",
                        }}
                    >
                        {element.content || "Enter code"}
                    </code>
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
                        {element.content && <span>{element.content}</span>}
                        {element.children?.length > 0 && (
                            <>
                                {element.children.map((child: any) =>
                                    renderElement
                                        ? renderElement(child, level + 1)
                                        : null,
                                )}
                            </>
                        )}
                    </>
                );
        }
    }, [element, level, renderElement]);

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
};

// Hook for using the element renderer
export const useElementRenderer = (
    isDragging: boolean,
    activeAction: "moving" | "scalling" | "grouping" | "grabbing",
    getElementStyle: (element: any) => React.CSSProperties,
    handleMouseDown: (
        e: React.MouseEvent,
        elementId: string | number,
        setSelectedId: (id: string | number | null) => void,
    ) => void,
    setSelectedId: (id: string | number | null) => void,
) => {
    const renderElement = useCallback(
        (element: any, level: number = 0): React.ReactElement => {
            return (
                <ElementRenderer
                    key={element.id}
                    element={element}
                    level={level}
                    isDragging={isDragging}
                    activeAction={activeAction}
                    getElementStyle={getElementStyle}
                    handleMouseDown={handleMouseDown}
                    setSelectedId={setSelectedId}
                    renderElement={renderElement}
                />
            );
        },
        [
            isDragging,
            activeAction,
            getElementStyle,
            handleMouseDown,
            setSelectedId,
        ],
    );

    return { renderElement };
};
