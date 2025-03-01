import * as React from "react";
import "./index.scss";

export const ButtonWrapper = ({
    children,
    label,
    isActive = false,
}: {
    children: React.ReactNode;
    label: string;
    isActive?: boolean;
}) => {
    return (
        <div className={`button-wrapper ${isActive ? "active" : ""}`}>
            {children}
            <div className="button-label">{label}</div>
        </div>
    );
};
