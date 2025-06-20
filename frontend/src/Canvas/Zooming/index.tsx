import React, { useCallback, useState } from "react";
import { Minus, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { ScreenSizeSwitcher } from "../ScreenSizeSwitcher";

interface ZoomingControlProps {
    screen: "mobile" | "desktop" | "tablet";
    setScreen: (screen: "mobile" | "desktop" | "tablet") => void;
    zoomLevel: number;
    setZoomLevel: (zoomLevel: number) => void;
}

export const ZoomingControl: React.FC<ZoomingControlProps> = ({
    screen,
    setScreen,
    zoomLevel,
    setZoomLevel,
}) => {
    // Zoom constants
    const maxZoomLevel = 3;
    const minZoomLevel = 0.3;
    const zoomStepper = 0.1;
    const ZoomIconSize = 16;

    const handleZoomIn = useCallback(() => {
        setZoomLevel(Math.min(zoomLevel + zoomStepper, maxZoomLevel));
    }, [zoomLevel, setZoomLevel]);

    const handleZoomOut = useCallback(() => {
        setZoomLevel(Math.max(zoomLevel - zoomStepper, minZoomLevel));
    }, [zoomLevel, setZoomLevel]);

    const handleZoomReset = useCallback(() => {
        setZoomLevel(1);
    }, [setZoomLevel]);

    return (
        <div className="status-bar-container">
            <ScreenSizeSwitcher screen={screen} setScreen={setScreen} />

            <div className="zoom-buttons-container">
                <div className="zoom-out-btn zoom-btn" onClick={handleZoomOut}>
                    <ZoomOut size={ZoomIconSize} />
                </div>
                {zoomLevel !== 1 && (
                    <div
                        className="zoom-reset-btn zoom-btn"
                        onClick={handleZoomReset}
                    >
                        <RotateCcw size={ZoomIconSize} />
                    </div>
                )}
                <div className="zoom-in-btn zoom-btn" onClick={handleZoomIn}>
                    <ZoomIn size={ZoomIconSize} />
                </div>
            </div>

            <div className="publish-container">publish</div>
        </div>
    );
};
