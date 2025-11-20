import { useState } from "react";
import "./index.scss";

export const Tabs = ({ tab_items }) => {
    const [activeTab, setActiveTab] = useState(tab_items[0]);

    return (
        <div className="modal-tabs-container">
            <div className="modal-tabs-wrapper">
                <div className="spacer tab"></div>
                {tab_items.map((tab) => (
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
