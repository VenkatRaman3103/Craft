import * as React from "react";
import "./index.scss";

export const ButtonWrapper = ({
    children,
    label,
}: {
    children: React.ReactNode;
    label: string;
}) => {
    return (
        <div className="button-wrapper">
            {children}
            <div className="button-label">{label}</div>
        </div>
    );
};
