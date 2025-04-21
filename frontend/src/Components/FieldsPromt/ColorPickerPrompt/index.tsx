import React, { useState, useRef, useEffect } from "react";
import "./index.scss";
import { Copy } from "lucide-react";
import { colorPicker } from "@/Types/fields";

export const ColorPickerPrompt = ({
    color,
    setColor,
}: {
    color: colorPicker;
    setColor: React.Dispatch<React.SetStateAction<colorPicker>>;
}) => {
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
    const [value, setValue] = useState(0);
    const [alpha, setAlpha] = useState(1);
    const [hexInput, setHexInput] = useState("#000000");

    const userInteractionRef = useRef(false);

    const pickerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const saturationRef = useRef<HTMLDivElement>(null);

    const rgbToHex = (r: number, g: number, b: number) => {
        const toHex = (c: number) => {
            const hex = Math.round(c).toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        };
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    };

    const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
            ? {
                  r: parseInt(result[1], 16),
                  g: parseInt(result[2], 16),
                  b: parseInt(result[3], 16),
              }
            : { r: 0, g: 0, b: 0 };
    };

    const rgbToHsv = (r: number, g: number, b: number) => {
        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0;
        const v = max;
        const d = max - min;
        const s = max === 0 ? 0 : d / max;

        if (max === min) {
            h = 0;
        } else {
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
            }
            h /= 6;
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            v: Math.round(v * 100),
        };
    };

    const hsvToRgb = (h: number, s: number, v: number) => {
        h /= 360;
        s /= 100;
        v /= 100;

        let r, g, b;

        const i = Math.floor(h * 6);
        const f = h * 6 - i;
        const p = v * (1 - s);
        const q = v * (1 - f * s);
        const t = v * (1 - (1 - f) * s);

        switch (i % 6) {
            case 0:
                r = v;
                g = t;
                b = p;
                break;
            case 1:
                r = q;
                g = v;
                b = p;
                break;
            case 2:
                r = p;
                g = v;
                b = t;
                break;
            case 3:
                r = p;
                g = q;
                b = v;
                break;
            case 4:
                r = t;
                g = p;
                b = v;
                break;
            case 5:
                r = v;
                g = p;
                b = q;
                break;
            default:
                r = v;
                g = t;
                b = p;
        }

        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255),
        };
    };

    const hsvToHsl = (h: number, s: number, v: number) => {
        s /= 100;
        v /= 100;

        const l = v * (1 - s / 2);
        const s_hsl = l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l);

        return {
            h,
            s: Math.round(s_hsl * 100),
            l: Math.round(l * 100),
        };
    };

    const updateColorFormats = (
        h: number,
        s: number,
        v: number,
        a = 1,
        updateParent = false,
    ) => {
        const { r, g, b } = hsvToRgb(h, s, v);

        const { s: s_hsl, l } = hsvToHsl(h, s, v);

        const hexValue = rgbToHex(r, g, b);
        const rgbValue = `rgb(${r}, ${g}, ${b})`;
        const rgbaValue = `rgba(${r}, ${g}, ${b}, ${a})`;
        const hslValue = `hsl(${h}, ${s_hsl}%, ${l}%)`;
        const hslaValue = `hsla(${h}, ${s_hsl}%, ${l}%, ${a})`;

        setColorFormats({
            hex: hexValue,
            rgb: rgbValue,
            rgba: rgbaValue,
            hsl: hslValue,
            hsla: hslaValue,
        });

        setHexInput(hexValue);

        if (updateParent) {
            setColor({
                hex: hexValue,
                rgb: { r, g, b },
                rgba: { r, g, b, a },
                hsl: { h, s: s_hsl, l },
                hsla: { h, s: s_hsl, l, a },
                value: hexValue,
            });
        }
    };

    useEffect(() => {
        if (userInteractionRef.current) {
            userInteractionRef.current = false;
            return;
        }

        if (color) {
            let h = 0,
                s = 0,
                v = 0,
                a = 1;

            if (typeof color === "string") {
                const { r, g, b } = hexToRgb(color);
                const hsvValues = rgbToHsv(r, g, b);
                h = hsvValues.h;
                s = hsvValues.s;
                v = hsvValues.v;
            } else {
                if (color.hex) {
                    const { r, g, b } = hexToRgb(color.hex);
                    const hsvValues = rgbToHsv(r, g, b);
                    h = hsvValues.h;
                    s = hsvValues.s;
                    v = hsvValues.v;
                    a = color.hsla?.a ?? 1;
                } else if (color.rgb) {
                    const hsvValues = rgbToHsv(
                        color.rgb.r,
                        color.rgb.g,
                        color.rgb.b,
                    );
                    h = hsvValues.h;
                    s = hsvValues.s;
                    v = hsvValues.v;
                    a = 1;
                } else if (color.rgba) {
                    const hsvValues = rgbToHsv(
                        color.rgba.r,
                        color.rgba.g,
                        color.rgba.b,
                    );
                    h = hsvValues.h;
                    s = hsvValues.s;
                    v = hsvValues.v;
                    a = color.rgba.a ?? 1;
                } else if (color.hsl) {
                    const l = color.hsl.l / 100;
                    const s_hsl = color.hsl.s / 100;
                    const h_hsl = color.hsl.h;

                    const temp1 =
                        l < 0.5 ? l * (1 + s_hsl) : l + s_hsl - l * s_hsl;
                    const temp2 = 2 * l - temp1;

                    const h_normalized = h_hsl / 360;

                    const r = Math.round(
                        hueToRgb(temp2, temp1, h_normalized + 1 / 3) * 255,
                    );
                    const g = Math.round(
                        hueToRgb(temp2, temp1, h_normalized) * 255,
                    );
                    const b = Math.round(
                        hueToRgb(temp2, temp1, h_normalized - 1 / 3) * 255,
                    );

                    const hsvValues = rgbToHsv(r, g, b);
                    h = hsvValues.h;
                    s = hsvValues.s;
                    v = hsvValues.v;

                    a = color.hsla?.a ?? 1;
                }
            }

            setHue(h);
            setSaturation(s);
            setValue(v);
            setAlpha(a);
            updateColorFormats(h, s, v, a, false);
        } else {
            setHue(0);
            setSaturation(0);
            setValue(0);
            setAlpha(1);
            updateColorFormats(0, 0, 0, 1, false);
        }
    }, [color]);

    function hueToRgb(p: number, q: number, t: number) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    }

    const handleHueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        userInteractionRef.current = true;
        const newHue = parseInt(e.target.value);
        setHue(newHue);
        updateColorFormats(newHue, saturation, value, alpha, true);
    };

    const handleSaturationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        userInteractionRef.current = true;
        const newSaturation = parseInt(e.target.value);
        setSaturation(newSaturation);
        updateColorFormats(hue, newSaturation, value, alpha, true);
    };

    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        userInteractionRef.current = true;
        const newValue = parseInt(e.target.value);
        setValue(newValue);
        updateColorFormats(hue, saturation, newValue, alpha, true);
    };

    const handleAlphaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        userInteractionRef.current = true;
        const newAlpha = parseFloat(e.target.value);
        setAlpha(newAlpha);
        updateColorFormats(hue, saturation, value, newAlpha, true);
    };

    const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setHexInput(value);

        if (/^#[0-9A-Fa-f]{6}$/i.test(value)) {
            userInteractionRef.current = true;
            const { r, g, b } = hexToRgb(value);
            const { h, s, v } = rgbToHsv(r, g, b);
            const { s: s_hsl, l } = hsvToHsl(h, s, v);

            setHue(h);
            setSaturation(s);
            setValue(v);

            setColorFormats({
                hex: value,
                rgb: `rgb(${r}, ${g}, ${b})`,
                rgba: `rgba(${r}, ${g}, ${b}, ${alpha})`,
                hsl: `hsl(${h}, ${s_hsl}%, ${l}%)`,
                hsla: `hsla(${h}, ${s_hsl}%, ${l}%, ${alpha})`,
            });

            setColor({
                hex: value,
                rgb: { r, g, b },
                rgba: { r, g, b, a: alpha },
                hsl: { h, s: s_hsl, l },
                hsla: { h, s: s_hsl, l, a: alpha },
                value: value,
            });
        }
    };

    const handleSaturationPickerClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        userInteractionRef.current = true;

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

            const newSaturation = Math.round(x * 100);
            const newValue = Math.round((1 - y) * 100);

            setSaturation(newSaturation);
            setValue(newValue);
            updateColorFormats(hue, newSaturation, newValue, alpha, true);
        }
    };

    const toggleDropdown = (e: React.MouseEvent) => {
        setIsOpen(!isOpen);
        e.stopPropagation();
    };

    const handleDropdownClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                pickerRef.current &&
                !pickerRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const copyToClipboard = (text: string, e: React.MouseEvent) => {
        navigator.clipboard.writeText(text);
        e.stopPropagation();
    };

    const generateHueColors = () => {
        const colors = [];
        for (let i = 0; i <= 360; i += 60) {
            colors.push(`hsl(${i}, 100%, 50%)`);
        }
        return `linear-gradient(to right, ${colors.join(", ")})`;
    };

    const generateSaturationBackground = () => {
        return `linear-gradient(to right, hsl(${hue}, 0%, ${value / 2}%), hsl(${hue}, 100%, ${value / 2}%))`;
    };

    const generateValueBackground = () => {
        return `linear-gradient(to right, hsl(${hue}, ${saturation}%, 0%), hsl(${hue}, ${saturation}%, 50%))`;
    };

    const generateAlphaBackground = () => {
        return `linear-gradient(to right, rgba(${hexToRgb(colorFormats.hex).r}, ${hexToRgb(colorFormats.hex).g}, ${hexToRgb(colorFormats.hex).b}, 0), rgba(${hexToRgb(colorFormats.hex).r}, ${hexToRgb(colorFormats.hex).g}, ${hexToRgb(colorFormats.hex).b}, 1))`;
    };

    return (
        <div className="color-picker-container" ref={pickerRef}>
            <div className="color-preview" onClick={toggleDropdown}>
                <div
                    className="color-display"
                    style={{ backgroundColor: colorFormats.hex }}
                />
            </div>

            <div className="color-preview-text" onClick={toggleDropdown}>
                {colorFormats.hex}
            </div>

            {isOpen && (
                <div
                    className="color-picker-dropdown"
                    ref={dropdownRef}
                    onClick={handleDropdownClick}
                >
                    <div className="color-picker-header">{/*  */}</div>

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
                                top: `${100 - value}%`,
                            }}
                        />
                    </div>

                    <div className="color-controls">
                        <div className="control-row">
                            <label>Hue</label>
                            <div className="slider-container">
                                <div
                                    className="slider-background"
                                    style={{ background: generateHueColors() }}
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
                            <label>Value</label>
                            <div className="slider-container">
                                <div
                                    className="slider-background"
                                    style={{
                                        background: generateValueBackground(),
                                    }}
                                />
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={value}
                                    onChange={handleValueChange}
                                    className="value-slider color-slider"
                                />
                            </div>
                            <span>{value}%</span>
                        </div>

                        <div className="control-row">
                            <label>Alpha</label>
                            <div className="slider-container">
                                <div
                                    className="slider-background alpha-background"
                                    style={{
                                        background: generateAlphaBackground(),
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
                                maxLength={7}
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
                                            onClick={(e) =>
                                                copyToClipboard(
                                                    colorFormats.hex,
                                                    e,
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
                                            onClick={(e) =>
                                                copyToClipboard(
                                                    colorFormats.rgb,
                                                    e,
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
                                            onClick={(e) =>
                                                copyToClipboard(
                                                    colorFormats.rgba,
                                                    e,
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
                                            onClick={(e) =>
                                                copyToClipboard(
                                                    colorFormats.hsl,
                                                    e,
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
                                            onClick={(e) =>
                                                copyToClipboard(
                                                    colorFormats.hsla,
                                                    e,
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
    );
};
