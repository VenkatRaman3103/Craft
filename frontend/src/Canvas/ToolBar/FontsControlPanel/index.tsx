import {
    AlignCenter,
    AlignHorizontalSpaceAroundIcon,
    AlignLeft,
    AlignRight,
    AlignVerticalSpaceAroundIcon,
    Bold,
    Italic,
    Type,
    Underline,
} from "lucide-react";
import { useState } from "react";

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
