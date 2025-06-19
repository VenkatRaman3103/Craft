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
import { useSelector, useDispatch } from "react-redux";
import { StoreState } from "@/store/store";
import {
    updateFontFamily,
    updateFontWeight,
    updateFontSize,
    updateFontStyle,
    updateTextDecoration,
    updateTextAlign,
    updateLineHeight,
    updateLetterSpacing,
    FontWeight,
    FontStyle,
    TextDecoration,
    TextAlign,
} from "@/store/toolbar/fontsControl/fontsControl";

const fontFamilyOptions = [
    { value: "Arial, sans-serif", label: "Arial" },
    { value: "Georgia, serif", label: "Georgia" },
    { value: "Times New Roman, serif", label: "Times New Roman" },
    { value: "Helvetica, sans-serif", label: "Helvetica" },
    { value: "Courier New, monospace", label: "Courier New" },
    { value: "Verdana, sans-serif", label: "Verdana" },
];

const fontWeightOptions = [
    { value: "300" as FontWeight, label: "Light" },
    { value: "normal" as FontWeight, label: "Normal" },
    { value: "500" as FontWeight, label: "Medium" },
    { value: "bold" as FontWeight, label: "Bold" },
    { value: "800" as FontWeight, label: "Extra Bold" },
];

export const FontsControlPanel = () => {
    const dispatch = useDispatch();
    const {
        fontFamily,
        fontWeight,
        fontSize,
        fontStyle,
        textDecoration,
        textAlign,
        lineHeight,
        letterSpacing,
    } = useSelector((state: StoreState) => state.fontControl);

    const fontIconSize = 16;

    const handleFontWeightToggle = () => {
        const newWeight: FontWeight = fontWeight === "bold" ? "normal" : "bold";
        dispatch(updateFontWeight(newWeight));
    };

    const handleFontStyleToggle = () => {
        const newStyle: FontStyle =
            fontStyle === "italic" ? "normal" : "italic";
        dispatch(updateFontStyle(newStyle));
    };

    const handleTextDecorationToggle = () => {
        const newDecoration: TextDecoration =
            textDecoration === "underline" ? "none" : "underline";
        dispatch(updateTextDecoration(newDecoration));
    };

    const handleTextAlignChange = (align: TextAlign) => {
        dispatch(updateTextAlign(align));
    };

    return (
        <div className="fonts-section-container toolbar-section">
            <div className="heading">font</div>
            <div className="font-sizing-sub-section">
                <div className="font-sizing-section">
                    <div className="heading">font</div>
                    <div className="font-sizing-tools-container">
                        <select
                            className="font-style-select select-drop-down"
                            value={fontFamily}
                            onChange={(e) =>
                                dispatch(updateFontFamily(e.target.value))
                            }
                        >
                            {fontFamilyOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>

                        <select
                            className="font-width-select select-drop-down"
                            value={fontWeight}
                            onChange={(e) =>
                                dispatch(
                                    updateFontWeight(
                                        e.target.value as FontWeight,
                                    ),
                                )
                            }
                        >
                            {fontWeightOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>

                        <div className="font-decoration-tools">
                            <div className="font-size font-tool">
                                <Type size={fontIconSize} />
                                <input
                                    type="number"
                                    value={fontSize}
                                    onChange={(e) =>
                                        dispatch(
                                            updateFontSize(
                                                Number(e.target.value),
                                            ),
                                        )
                                    }
                                    min="8"
                                    max="72"
                                />
                            </div>
                            <div className="font-decoration-options">
                                <div
                                    className={`font-bold decoration-tool ${fontWeight === "bold" ? "active" : ""}`}
                                    onClick={handleFontWeightToggle}
                                >
                                    <Bold size={fontIconSize} />
                                </div>
                                <div
                                    className={`font-italic decoration-tool ${fontStyle === "italic" ? "active" : ""}`}
                                    onClick={handleFontStyleToggle}
                                >
                                    <Italic size={fontIconSize} />
                                </div>
                                <div
                                    className={`font-underline decoration-tool ${textDecoration === "underline" ? "active" : ""}`}
                                    onClick={handleTextDecorationToggle}
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
                                <input
                                    type="number"
                                    value={lineHeight}
                                    onChange={(e) =>
                                        dispatch(
                                            updateLineHeight(
                                                Number(e.target.value),
                                            ),
                                        )
                                    }
                                    step="0.1"
                                    min="0.5"
                                    max="3"
                                />
                            </div>
                            <div className="font-left-bottom-space font-space font-tool">
                                <AlignHorizontalSpaceAroundIcon
                                    size={fontIconSize}
                                />
                                <input
                                    type="number"
                                    value={letterSpacing}
                                    onChange={(e) =>
                                        dispatch(
                                            updateLetterSpacing(
                                                Number(e.target.value),
                                            ),
                                        )
                                    }
                                    step="0.1"
                                    min="-2"
                                    max="5"
                                />
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
                                    className={`left-align-tool align-tool ${textAlign === "left" ? "active" : ""}`}
                                    onClick={() =>
                                        handleTextAlignChange("left")
                                    }
                                >
                                    <AlignLeft size={fontIconSize} />
                                </div>
                                <div
                                    className={`centre-align-tool align-tool ${textAlign === "center" ? "active" : ""}`}
                                    onClick={() =>
                                        handleTextAlignChange("center")
                                    }
                                >
                                    <AlignCenter size={fontIconSize} />
                                </div>
                                <div
                                    className={`right-align-tool align-tool ${textAlign === "right" ? "active" : ""}`}
                                    onClick={() =>
                                        handleTextAlignChange("right")
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
