import React, { useState, useRef, useEffect } from "react";
import "./index.scss";
import { ChevronDown, Copy } from "lucide-react";
import { FieldWrapper } from "@/Components/Fields/FieldWrapper";

export const ColorPicker = ({ data }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const [colorFormats, setColorFormats] = useState({
        hex: "#000000",
        rgb: "rgb(0, 0, 0)",
        rgba: "rgba(0, 0, 0, 1)",
        hsl: "hsl(0, 0%, 0%)",
        hsla: "hsla(0, 0%, 0%, 1)",
    });
    const [hue, setHue] = useState(0);
    const [saturation, setSaturation] = useState(0);
    const [lightness, setLightness] = useState(0);
    const [alpha, setAlpha] = useState(1);
    const [hexInput, setHexInput] = useState("#000000");

    const pickerRef = useRef(null);
    const saturationRef = useRef(null);

    // const handleColorChange = (colorData) => {
    //     setSelectedColor(colorData);
    //     console.log("Color changed:", colorData);
    // };

    // Convert RGB to HEX
    const rgbToHex = (r, g, b) => {
        const toHex = (c) => {
            const hex = Math.round(c).toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        };
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    };

    // Convert HEX to RGB
    const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
            ? {
                  r: parseInt(result[1], 16),
                  g: parseInt(result[2], 16),
                  b: parseInt(result[3], 16),
              }
            : { r: 0, g: 0, b: 0 };
    };

    // Convert RGB to HSL
    const rgbToHsl = (r, g, b) => {
        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h,
            s,
            l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
                default:
                    h = 0;
            }

            h /= 6;
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100),
        };
    };

    // Convert HSL to RGB
    const hslToRgb = (h, s, l) => {
        h /= 360;
        s /= 100;
        l /= 100;

        let r, g, b;

        if (s === 0) {
            r = g = b = l; // achromatic
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;

            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255),
        };
    };

    // Update all color formats
    const updateColorFormats = (h, s, l, a = 1) => {
        // Convert HSL to RGB
        const { r, g, b } = hslToRgb(h, s, l);

        // Generate all formats
        const hexValue = rgbToHex(r, g, b);
        const rgbValue = `rgb(${r}, ${g}, ${b})`;
        const rgbaValue = `rgba(${r}, ${g}, ${b}, ${a})`;
        const hslValue = `hsl(${h}, ${s}%, ${l}%)`;
        const hslaValue = `hsla(${h}, ${s}%, ${l}%, ${a})`;

        setColorFormats({
            hex: hexValue,
            rgb: rgbValue,
            rgba: rgbaValue,
            hsl: hslValue,
            hsla: hslaValue,
        });

        // Update the hex input value
        setHexInput(hexValue);

        // Update the actual color state for parent component
        // setColor({
        //     hex: hexValue,
        //     rgb: { r, g, b },
        //     rgba: { r, g, b, a },
        //     hsl: { h, s, l },
        //     hsla: { h, s, l, a },
        //     value: hexValue, // For backward compatibility
        // });
    };

    // Initialize component with provided color
    useEffect(() => {
        if (data) {
            let h,
                s,
                l,
                a = 1;

            if (typeof data === "string") {
                // It's a hex color
                const { r, g, b } = hexToRgb(data);
                const hslValues = rgbToHsl(r, g, b);
                h = hslValues.h;
                s = hslValues.s;
                l = hslValues.l;
            } else if (data.hex) {
                // It's our color object
                const { r, g, b } = hexToRgb(data.hex);
                const hslValues = rgbToHsl(r, g, b);
                h = hslValues.h;
                s = hslValues.s;
                l = hslValues.l;
                a = data.hsla?.a || 1;
            } else if (
                data.h !== undefined &&
                data.s !== undefined &&
                data.l !== undefined
            ) {
                // It's an HSL object
                h = data.h;
                s = data.s;
                l = data.l;
                a = data.a || 1;
            } else if (
                data.r !== undefined &&
                data.g !== undefined &&
                data.b !== undefined
            ) {
                // It's an RGB object
                const hslValues = rgbToHsl(data.r, data.g, data.b);
                h = hslValues.h;
                s = hslValues.s;
                l = hslValues.l;
                a = data.a || 1;
            }

            setHue(h);
            setSaturation(s);
            setLightness(l);
            setAlpha(a);
            updateColorFormats(h, s, l, a);
        } else {
            // Default black color
            setHue(0);
            setSaturation(0);
            setLightness(0);
            setAlpha(1);
            updateColorFormats(0, 0, 0, 1);
        }
    }, []);

    // Handle hue change
    const handleHueChange = (e) => {
        const newHue = parseInt(e.target.value);
        setHue(newHue);
        updateColorFormats(newHue, saturation, lightness, alpha);
    };

    // Handle saturation change
    const handleSaturationChange = (e) => {
        const newSaturation = parseInt(e.target.value);
        setSaturation(newSaturation);
        updateColorFormats(hue, newSaturation, lightness, alpha);
    };

    // Handle lightness change
    const handleLightnessChange = (e) => {
        const newLightness = parseInt(e.target.value);
        setLightness(newLightness);
        updateColorFormats(hue, saturation, newLightness, alpha);
    };

    // Handle alpha change
    const handleAlphaChange = (e) => {
        const newAlpha = parseFloat(e.target.value);
        setAlpha(newAlpha);
        updateColorFormats(hue, saturation, lightness, newAlpha);
    };

    // Handle hex input change
    const handleHexChange = (e) => {
        const value = e.target.value;
        setHexInput(value);

        // Only update other values if it's a valid hex color
        if (/^#[0-9A-Fa-f]{6}$/i.test(value)) {
            const { r, g, b } = hexToRgb(value);
            const { h, s, l } = rgbToHsl(r, g, b);

            setHue(h);
            setSaturation(s);
            setLightness(l);

            // Update all color formats
            setColorFormats({
                hex: value,
                rgb: `rgb(${r}, ${g}, ${b})`,
                rgba: `rgba(${r}, ${g}, ${b}, ${alpha})`,
                hsl: `hsl(${h}, ${s}%, ${l}%)`,
                hsla: `hsla(${h}, ${s}%, ${l}%, ${alpha})`,
            });

            // Update the parent color state
            // setColor({
            //     hex: value,
            //     rgb: { r, g, b },
            //     rgba: { r, g, b, a: alpha },
            //     hsl: { h, s, l },
            //     hsla: { h, s, l, a: alpha },
            //     value: value,
            // });
        }
    };

    // Handle color picker click
    const handleSaturationPickerClick = (e) => {
        if (saturationRef.current) {
            const rect = saturationRef.current.getBoundingClientRect();
            const x = Math.max(
                0,
                Math.min(1, (e.clientX - rect.left) / rect.width),
            );
            const y = Math.max(
                0,
                Math.min(1, (e.clientY - rect.top) / rect.height),
            );

            // Calculate saturation and lightness from x,y
            const newSaturation = Math.round(x * 100);
            const newLightness = Math.round((1 - y) * 100);

            setSaturation(newSaturation);
            setLightness(newLightness);
            updateColorFormats(hue, newSaturation, newLightness, alpha);
        }
    };

    // Handle document click to close dropdown
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (pickerRef.current && !pickerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Handle copy format to clipboard
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        // You could add a temporary "Copied!" notification here
    };

    // Create an array of hue colors for the slider background
    const generateHueColors = () => {
        const colors = [];
        for (let i = 0; i <= 360; i += 60) {
            colors.push(`hsl(${i}, 100%, 50%)`);
        }
        return `linear-gradient(to right, ${colors.join(", ")})`;
    };

    // Generate a background for the saturation slider
    const generateSaturationBackground = () => {
        return `linear-gradient(to right, hsl(${hue}, 0%, ${lightness}%), hsl(${hue}, 100%, ${lightness}%))`;
    };

    // Generate a background for the lightness slider
    const generateLightnessBackground = () => {
        return `linear-gradient(to right, hsl(${hue}, ${saturation}%, 0%), hsl(${hue}, ${saturation}%, 50%), hsl(${hue}, ${saturation}%, 100%))`;
    };

    // Generate a background for the alpha slider
    const generateAlphaBackground = () => {
        return `linear-gradient(to right, rgba(${hexToRgb(colorFormats.hex).r}, ${hexToRgb(colorFormats.hex).g}, ${hexToRgb(colorFormats.hex).b}, 0), rgba(${hexToRgb(colorFormats.hex).r}, ${hexToRgb(colorFormats.hex).g}, ${hexToRgb(colorFormats.hex).b}, 1))`;
    };

    console.log(data, "data");

    return (
        <FieldWrapper data={data}>
            <div
                className="color-picker-container"
                onClick={() => setIsOpen(!isOpen)}
                ref={pickerRef}
            >
                <div className="color-preview">
                    <div
                        className="color-display"
                        style={{ backgroundColor: colorFormats.hex }}
                    >
                        {/* <ChevronDown size={16} /> */}
                    </div>
                </div>

                <div className="color-preview-text">{colorFormats.hex}</div>

                {isOpen && (
                    <div className="color-picker-dropdown">
                        <div className="color-picker-header">
                            {/* <div */}
                            {/*     className="current-color-preview" */}
                            {/*     style={{ backgroundColor: colorFormats.rgba }} */}
                            {/* /> */}
                        </div>

                        <div
                            className="saturation-picker"
                            ref={saturationRef}
                            onClick={handleSaturationPickerClick}
                            style={{
                                backgroundColor: `hsl(${hue}, 100%, 50%)`,
                            }}
                        >
                            <div className="saturation-white canvas" />
                            <div className="saturation-black canvas" />
                            <div
                                className="saturation-picker-cursor"
                                style={{
                                    left: `${saturation}%`,
                                    bottom: `${lightness}%`,
                                }}
                            />
                        </div>

                        <div className="color-controls">
                            <div className="control-row">
                                <label>Hue</label>
                                <div className="slider-container">
                                    <div
                                        className="slider-background"
                                        style={{
                                            background: generateHueColors(),
                                        }}
                                    />
                                    <input
                                        type="range"
                                        min="0"
                                        max="360"
                                        value={hue}
                                        onChange={handleHueChange}
                                        className="hue-slider color-slider"
                                    />
                                </div>
                                <span>{hue}°</span>
                            </div>

                            <div className="control-row">
                                <label>Saturation</label>
                                <div className="slider-container">
                                    <div
                                        className="slider-background"
                                        style={{
                                            background:
                                                generateSaturationBackground(),
                                        }}
                                    />
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={saturation}
                                        onChange={handleSaturationChange}
                                        className="saturation-slider color-slider"
                                    />
                                </div>
                                <span>{saturation}%</span>
                            </div>

                            <div className="control-row">
                                <label>Lightness</label>
                                <div className="slider-container">
                                    <div
                                        className="slider-background"
                                        style={{
                                            background:
                                                generateLightnessBackground(),
                                        }}
                                    />
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={lightness}
                                        onChange={handleLightnessChange}
                                        className="lightness-slider color-slider"
                                    />
                                </div>
                                <span>{lightness}%</span>
                            </div>

                            <div className="control-row">
                                <label>Alpha</label>
                                <div className="slider-container">
                                    <div
                                        className="slider-background alpha-background"
                                        style={{
                                            background:
                                                generateAlphaBackground(),
                                        }}
                                    />
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        value={alpha}
                                        onChange={handleAlphaChange}
                                        className="alpha-slider color-slider"
                                    />
                                </div>
                                <span>{alpha.toFixed(2)}</span>
                            </div>

                            <div className="hex-input-row">
                                <label>HEX</label>
                                <input
                                    type="text"
                                    value={hexInput}
                                    onChange={handleHexChange}
                                    maxLength="7"
                                />
                            </div>
                        </div>

                        <div className="color-formats-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Format</th>
                                        <th>Value</th>
                                        <th>Copy</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>HEX</td>
                                        <td className="format-value">
                                            {colorFormats.hex}
                                        </td>
                                        <td>
                                            <button
                                                className="copy-button"
                                                onClick={() =>
                                                    copyToClipboard(
                                                        colorFormats.hex,
                                                    )
                                                }
                                            >
                                                <Copy size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>RGB</td>
                                        <td className="format-value">
                                            {colorFormats.rgb}
                                        </td>
                                        <td>
                                            <button
                                                className="copy-button"
                                                onClick={() =>
                                                    copyToClipboard(
                                                        colorFormats.rgb,
                                                    )
                                                }
                                            >
                                                <Copy size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>RGBA</td>
                                        <td className="format-value">
                                            {colorFormats.rgba}
                                        </td>
                                        <td>
                                            <button
                                                className="copy-button"
                                                onClick={() =>
                                                    copyToClipboard(
                                                        colorFormats.rgba,
                                                    )
                                                }
                                            >
                                                <Copy size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>HSL</td>
                                        <td className="format-value">
                                            {colorFormats.hsl}
                                        </td>
                                        <td>
                                            <button
                                                className="copy-button"
                                                onClick={() =>
                                                    copyToClipboard(
                                                        colorFormats.hsl,
                                                    )
                                                }
                                            >
                                                <Copy size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>HSLA</td>
                                        <td className="format-value">
                                            {colorFormats.hsla}
                                        </td>
                                        <td>
                                            <button
                                                className="copy-button"
                                                onClick={() =>
                                                    copyToClipboard(
                                                        colorFormats.hsla,
                                                    )
                                                }
                                            >
                                                <Copy size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </FieldWrapper>
    );
};
