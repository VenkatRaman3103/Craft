import React, { useEffect, useRef, useState } from "react";
import "./index.scss";
import { elementType } from "@/Types/canvas/elementsType";
import {
    Blocks,
    Hand,
    MessageCircle,
    Move,
    Scaling,
    Type,
    LayoutGrid,
    Nut,
    Image,
    List,
    Landmark,
    MousePointerClick,
    Table,
} from "lucide-react";

const elementsHash = {
    layouts: ["div", "section", "article", "header", "footer", "main"],
    text: ["p", "h1", "h2", "h3", "span", "strong", "em", "blockquote", "code"],
    input: ["text", "textarea", "checkbox", "radio", "button", "select"],
    media: ["img", "video", "audio", "iframe"],
    list: ["ul", "ol", "li"],
    semantic: ["nav", "aside", "figure", "figcaption", "form", "label"],
    interactive: ["details", "summary", "dialog", "progress", "meter"],
    table: [
        "table",
        "thead",
        "tbody",
        "tfoot",
        "tr",
        "th",
        "td",
        // "caption",
        // "colgroup",
        // "col",
    ],
};

export const iconStrockWidth = 1.5;
export const iconSize = 16;

const elementTypeIcons = {
    layouts: <LayoutGrid size={iconSize} strokeWidth={iconStrockWidth} />,
    text: <Type size={iconSize} strokeWidth={iconStrockWidth} />,
    input: <Nut size={iconSize} strokeWidth={iconStrockWidth} />,
    media: <Image size={iconSize} strokeWidth={iconStrockWidth} />,
    list: <List size={iconSize} strokeWidth={iconStrockWidth} />,
    semantic: <Landmark size={iconSize} strokeWidth={iconStrockWidth} />,
    interactive: (
        <MousePointerClick size={iconSize} strokeWidth={iconStrockWidth} />
    ),
    table: <Table size={iconSize} strokeWidth={iconStrockWidth} />,
};

export const ElementPicker = ({ addElement }: any) => {
    const [activeType, setActiveType] = useState<elementType>("layouts");
    const [showTypeSelector, setShowTypeSelector] = useState(false);
    const typePopupReft = useRef<HTMLDivElement | null>(null);
    const elementsContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                typePopupReft.current &&
                !typePopupReft.current.contains(event.target as Node)
            ) {
                setShowTypeSelector(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [typePopupReft]);

    return (
        <div className="element-picker-container">
            <div className="element-picker">
                {showTypeSelector && (
                    <div className="elements-type-selector" ref={typePopupReft}>
                        {Object.keys(elementsHash).map((item, ind) => (
                            <div
                                key={ind}
                                className={`elements-type-option ${activeType === item ? "active" : ""} `}
                                onClick={() =>
                                    setActiveType(item as elementType)
                                }
                            >
                                <span className="type-icon">
                                    {elementTypeIcons[item as elementType]}
                                </span>
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                )}

                <div className="elements-container" ref={elementsContainerRef}>
                    <div className="elements">
                        <div className="section element-type-section">
                            <div
                                className={`elements-type ${showTypeSelector ? "active" : ""}`}
                                onClick={() => setShowTypeSelector(true)}
                            >
                                <span className="type-icon">
                                    {elementTypeIcons[activeType]}
                                </span>
                                <span>{activeType}</span>
                            </div>
                            <div className="tools">
                                {elementsHash[activeType].map((item, ind) => (
                                    <button
                                        className="tool-button"
                                        key={ind}
                                        onClick={() => addElement(item)}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="section">
                            <button className="tool-button hand">
                                <Hand
                                    strokeWidth={iconStrockWidth}
                                    size={iconSize}
                                />
                            </button>
                            <button className="tool-button scale">
                                <Scaling
                                    strokeWidth={iconStrockWidth}
                                    size={iconSize}
                                />
                            </button>
                            <button className="tool-button move">
                                <Move
                                    strokeWidth={iconStrockWidth}
                                    size={iconSize}
                                />
                            </button>
                        </div>

                        <div className="section">
                            <button className="tool-button comment">
                                <MessageCircle
                                    strokeWidth={iconStrockWidth}
                                    size={iconSize}
                                />
                            </button>
                        </div>

                        <div className="section">
                            <button className="tool-button plugins">
                                <Blocks
                                    strokeWidth={iconStrockWidth}
                                    size={iconSize}
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
