import * as React from "react";
import "./index.scss";

export const Explorer = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="explorer-container">
            <div className="explorer-wrapper">
                <div className="explorer"></div>
                <div className="content-container">
                    <div className="content-wrapper">{children}</div>
                </div>
            </div>
        </div>
    );
};
