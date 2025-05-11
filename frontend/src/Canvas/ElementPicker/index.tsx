import React, { useEffect, useRef, useState } from "react";
import "./index.scss";

type elementType =
    | "layouts"
    | "input"
    | "text"
    | "media"
    | "list"
    | "semantic"
    | "interactive"
    | "table";

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
        "caption",
        "colgroup",
        "col",
    ],
};

export const ElementPicker = ({ addElement }: any) => {
    const [activeType, setActiveType] = useState<elementType>("layouts");
    const [showTypeSelector, setShowTypeSelector] = useState(false);
    const typePopupReft = useRef<HTMLDivElement | null>(null);

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
        <div className="element-picker">
            {showTypeSelector && (
                <div className="elements-type-selector" ref={typePopupReft}>
                    {Object.keys(elementsHash).map((item, ind) => (
                        <div
                            key={ind}
                            className={`elements-type-option ${activeType == item ? "active" : ""} `}
                            onClick={() => setActiveType(item)}
                        >
                            {item}
                        </div>
                    ))}
                </div>
            )}

            <div className="elements-container">
                <div className="elements">
                    <div
                        className="elements-type"
                        onClick={() => setShowTypeSelector(true)}
                    >
                        {activeType}
                    </div>
                    {elementsHash[activeType].map((item, ind) => (
                        <button
                            className="tool-button"
                            key={ind}
                            onClick={() => addElement(item)}
                        >
                            {item}
                        </button>
                    ))}
                    {/* <button */}
                    {/*     className="tool-button" */}
                    {/*     onClick={() => addElement("rectangle")} */}
                    {/* > */}
                    {/*     Rectangle */}
                    {/* </button> */}
                    {/* <button */}
                    {/*     className="tool-button" */}
                    {/*     onClick={() => addElement("circle")} */}
                    {/* > */}
                    {/*     Circle */}
                    {/* </button> */}
                    {/* <button */}
                    {/*     className="tool-button" */}
                    {/*     onClick={() => addElement("text")} */}
                    {/* > */}
                    {/*     Text */}
                    {/* </button> */}
                    {/* <button */}
                    {/*     className="tool-button" */}
                    {/*     onClick={() => addElement("image")} */}
                    {/* > */}
                    {/*     Image */}
                    {/* </button> */}
                </div>
            </div>
        </div>
    );
};
