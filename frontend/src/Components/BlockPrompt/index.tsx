import { useState, useRef, useEffect } from "react";
import "./index.scss";

export const BlockPrompt = ({
    blockInputs,
    block,
    handleCreateBlock,
    handleInputChange,
    handleBlockPromptCancel,
}) => {
    const [inputWidth, setInputWidth] = useState("auto");
    const inputRef = useRef(null);

    useEffect(() => {
        if (inputRef.current) {
            const span = document.createElement("span");
            span.textContent = blockInputs[block.id] || "Enter block name";
            span.style.visibility = "hidden";
            span.style.position = "absolute";
            span.style.fontSize = "16px";
            span.style.fontWeight = "500";
            span.style.whiteSpace = "nowrap";

            document.body.appendChild(span);
            const width = span.getBoundingClientRect().width;
            document.body.removeChild(span);

            setInputWidth(`${width + 10}px`);
        }
    }, [blockInputs, block.id]);

    return (
        <div className="block-promt-item">
            <div className="block-promt-container">
                <div className="block-promt-wrapper">
                    <div className="block-promt-header-container">
                        <div className="block-promt-header-wrapper">
                            <input
                                className="block-promt-input"
                                ref={inputRef}
                                style={{ width: inputWidth }}
                                value={blockInputs[block.id] || ""}
                                onChange={(e) => {
                                    handleInputChange(block.id, e.target.value);
                                }}
                                placeholder="Enter block name"
                            />
                            <div className="block-promt-type">
                                /{block.type}
                            </div>
                        </div>
                    </div>
                    <div className="action-btn-wrapper">
                        <button
                            className="create-block-button"
                            onClick={() => handleBlockPromptCancel(block)}
                        >
                            Cancel
                        </button>
                        <button
                            className="create-block-button"
                            onClick={() => handleCreateBlock(block)}
                        >
                            Create Block
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
