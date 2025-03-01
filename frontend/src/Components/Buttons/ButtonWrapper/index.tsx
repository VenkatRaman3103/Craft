import * as React from "react";
import "./index.scss";
import { lightFont } from "@/Styles/base";

export const ButtonWrapper = ({
    children,
    label,
    isActive = false,
    color = lightFont,
}: {
    children: React.ReactNode;
    label: string;
    isActive?: boolean;
    color?: string;
}) => {
    return (
        <div className={`button-wrapper ${isActive ? "active" : ""}`}>
            {children}
            <div style={{ color: color }} className="button-label">
                {label}
            </div>
        </div>
    );
};
