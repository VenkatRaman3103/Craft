import { useState } from "react";
import "./index.scss";

const tabs = ["Sections", "Blocks", "Fields"];

export const Tabs = () => {
    const [activeTab, setActiveTab] = useState(tabs[0]);

    return (
        <div className="modal-tabs-container">
            <div className="modal-tabs-wrapper">
                <div className="spacer tab"></div>
                {tabs.map((tab) => (
                    <div
                        className={`tab ${activeTab == tab ? "active" : ""}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </div>
                ))}
            </div>
        </div>
    );
};
