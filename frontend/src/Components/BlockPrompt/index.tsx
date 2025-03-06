import { useState } from "react";
import "./index.scss";

export const BlockPrompt = ({
    blockInputs,
    block,
    handleCreateBlock,
    handleInputChange,
}) => {
    console.log(blockInputs, "blockInputs");
    return (
        <div className="block-promt-item">
            <div className="block-promt-container">
                <div className="block-promt-wrapper">
                    <div className="block-promt-header-container">
                        <div className="block-promt-header-wrapper">
                            <input
                                className="block-promt-type"
                                value={blockInputs[block.id] || ""}
                                onChange={(e) =>
                                    handleInputChange(block.id, e.target.value)
                                }
                                placeholder="Enter block name"
                            />
                            <div className="ellipsis-container"></div>
                        </div>
                    </div>
                    <button
                        className="create-block-button"
                        onClick={() => handleCreateBlock(block)}
                    >
                        Create Block
                    </button>
                </div>
            </div>
        </div>
    );
};
