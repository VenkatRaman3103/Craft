import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Palette, ChevronDown, ChevronUp, Minus } from "lucide-react";
import { StoreState } from "@/store/store";
import {
    updateBackgroundColor,
    updateBorderColor,
    updateTextColor,
    updateShadowColor,
    updateGradientStart,
    updateGradientEnd,
    updateGradientDirection,
    updateUseGradient,
} from "@/store/toolbar/colorControl/colorControl";
import "./index.scss";

export type ControlPanelSelectType = {
    options: any;
    sectionTitle: string;
    elementStyle: any;
    updateDispatch: any;
};

export const ControlPanelSelect = ({
    options,
    sectionTitle,
    elementStyle,
    updateDispatch,
}: ControlPanelSelectType) => {
    const dispatch = useDispatch();
    return (
        <div className="border-width-sub-section">
            <div className="sub-heading">{sectionTitle}</div>
            <div className="border-width-tools-container">
                <select
                    className="select-drop-down"
                    value={elementStyle}
                    onChange={(e) => dispatch(updateDispatch(e.target.value))}
                >
                    {options.map(({ label, value }) => (
                        <option value={value} key={value}>
                            {label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

interface ColorControlPanelProps {
    selectedElement?: any;
    backgroundColor: string;
    borderColor: string;
    textColor: string;
    shadowColor: string;
    gradientStart: string;
    gradientEnd: string;
    gradientDirection: string;
    useGradient: boolean;
    onBackgroundColorChange: (color: string) => void;
    onBorderColorChange: (color: string) => void;
    onTextColorChange: (color: string) => void;
    onShadowColorChange: (color: string) => void;
    onGradientStartChange: (color: string) => void;
    onGradientEndChange: (color: string) => void;
    onGradientDirectionChange: (direction: string) => void;
    onUseGradientChange: (useGradient: boolean) => void;
}

export const ColorControlPanel: React.FC<ColorControlPanelProps> = ({
    selectedElement,
    backgroundColor,
    borderColor,
    textColor,
    shadowColor,
    gradientStart,
    gradientEnd,
    gradientDirection,
    useGradient,
    onBackgroundColorChange,
    onBorderColorChange,
    onTextColorChange,
    onShadowColorChange,
    onGradientStartChange,
    onGradientEndChange,
    onGradientDirectionChange,
    onUseGradientChange,
}) => {
    const [activeColorType, setActiveColorType] = useState<
        "background" | "border" | "text" | "shadow"
    >("background");

    const gradientDirections = [
        { label: "To Right", value: "to right" },
        { label: "To Left", value: "to left" },
        { label: "To Bottom", value: "to bottom" },
        { label: "To Top", value: "to top" },
        { label: "To Bottom Right", value: "to bottom right" },
        { label: "To Bottom Left", value: "to bottom left" },
        { label: "To Top Right", value: "to top right" },
        { label: "To Top Left", value: "to top left" },
    ];

    const presetColors = [
        "#ffffff",
        "#000000",
        "#ff0000",
        "#00ff00",
        "#0000ff",
        "#ffff00",
        "#ff00ff",
        "#00ffff",
        "#ffa500",
        "#800080",
        "#008000",
        "#000080",
        "#ff69b4",
        "#40e0d0",
        "#dda0dd",
        "#98fb98",
    ];

    const ColorPicker = ({
        label,
        value,
        onChange,
        showPresets = true,
    }: {
        label: string;
        value: string;
        onChange: (color: string) => void;
        showPresets?: boolean;
    }) => (
        <div className="color-picker-section">
            <label className="color-label">{label}</label>
            <div className="color-input-container">
                <input
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="color-input"
                />
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="color-text-input"
                    placeholder="#ffffff"
                />
            </div>
            {showPresets && (
                <div className="color-presets">
                    {presetColors.map((color) => (
                        <div
                            key={color}
                            className="color-preset"
                            style={{ backgroundColor: color }}
                            onClick={() => onChange(color)}
                            title={color}
                        />
                    ))}
                </div>
            )}
        </div>
    );

    // Custom ControlPanelSelect for gradient direction to use the prop handler
    const GradientDirectionSelect = () => (
        <div className="border-width-sub-section">
            <div className="sub-heading">Direction</div>
            <div className="border-width-tools-container">
                <select
                    className="select-drop-down"
                    value={gradientDirection}
                    onChange={(e) => onGradientDirectionChange(e.target.value)}
                >
                    {gradientDirections.map(({ label, value }) => (
                        <option value={value} key={value}>
                            {label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );

    if (!selectedElement) {
        return (
            <div className="control-panel-wrapper toolbar-section">
                <div className="control-header-wrapper">
                    {/* <Palette size={16} /> */}
                    <span>Colors</span>
                </div>
                <div className="control-content">
                    <p className="no-selection">
                        Select an element to edit colors
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="control-panel toolbar-section">
            <div className="control-header clickable">
                {/* <Palette size={16} /> */}
                <span>Colors</span>
            </div>

            <div className="control-content">
                <div className="color-tabs">
                    <button
                        className={`color-tab ${activeColorType === "background" ? "active" : ""}`}
                        onClick={() => setActiveColorType("background")}
                    >
                        bg
                    </button>
                    <button
                        className={`color-tab ${activeColorType === "border" ? "active" : ""}`}
                        onClick={() => setActiveColorType("border")}
                    >
                        Border
                    </button>
                    <button
                        className={`color-tab ${activeColorType === "text" ? "active" : ""}`}
                        onClick={() => setActiveColorType("text")}
                    >
                        Text
                    </button>
                    <button
                        className={`color-tab ${activeColorType === "shadow" ? "active" : ""}`}
                        onClick={() => setActiveColorType("shadow")}
                    >
                        Shadow
                    </button>
                </div>

                {activeColorType === "background" && (
                    <div className="color-section">
                        <div className="gradient-toggle">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={useGradient}
                                    onChange={(e) =>
                                        onUseGradientChange(e.target.checked)
                                    }
                                />
                                Use Gradient
                            </label>
                        </div>

                        {useGradient ? (
                            <>
                                <ColorPicker
                                    label="Gradient Start"
                                    value={gradientStart}
                                    onChange={onGradientStartChange}
                                />
                                <ColorPicker
                                    label="Gradient End"
                                    value={gradientEnd}
                                    onChange={onGradientEndChange}
                                />
                                <GradientDirectionSelect />
                            </>
                        ) : (
                            <ColorPicker
                                label="Background Color"
                                value={backgroundColor}
                                onChange={onBackgroundColorChange}
                            />
                        )}
                    </div>
                )}

                {activeColorType === "border" && (
                    <div className="color-section">
                        <ColorPicker
                            label="Border Color"
                            value={borderColor}
                            onChange={onBorderColorChange}
                        />
                    </div>
                )}

                {activeColorType === "text" && (
                    <div className="color-section">
                        <ColorPicker
                            label="Text Color"
                            value={textColor}
                            onChange={onTextColorChange}
                        />
                    </div>
                )}

                {activeColorType === "shadow" && (
                    <div className="color-section">
                        <ColorPicker
                            label="Shadow Color"
                            value={shadowColor}
                            onChange={onShadowColorChange}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
