import { useState } from "react";
import "./index.scss";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

// const tabs = ["Sections", "Blocks", "Fields"];

export const Tabs = () => {
    const { tab_items } = useSelector((state: RootState) => state.modalSlice);

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
