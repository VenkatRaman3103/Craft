import * as React from "react";
import "./index.scss";

export const Explorer = ({ children }: { children: React.ReactNode }) => {
    const [isIsometric, setIsIsometric] = React.useState(false);

    const toggleIsometric = () => {
        setIsIsometric(!isIsometric);
    };

    return (
        <div className="explorer-container">
            <div className="explorer-wrapper">
                <div className="explorer"></div>
                <div
                    className={`content-container ${isIsometric ? "isometric" : ""}`}
                >
                    <div className="content-wrapper">{children}</div>
                </div>
            </div>
            {/* <button className="isometric-toggle" onClick={toggleIsometric}> */}
            {/*     {isIsometric ? "Normal View" : "Isometric View"} */}
            {/* </button> */}
        </div>
    );
};
