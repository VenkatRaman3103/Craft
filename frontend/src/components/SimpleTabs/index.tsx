import { ReactNode, useState } from "react";
import "./index.scss";

type TabType = {
    id: string;
    name: string;
    label: string;
    component: ReactNode;
};

type SimpleTabsProps = {
    tabs: TabType[];
};

export const SimpleTabs = ({ tabs }: SimpleTabsProps) => {
    const [activeTab, setActiveTab] = useState<TabType>(tabs[0]);

    return (
        <div className="simple-tabs-container">
            <div className="simple-tabs-header-container">
                {tabs.map((t) => (
                    <div
                        key={t.id}
                        className={`tab-label ${t.id === activeTab.id ? "active" : ""}`}
                        onClick={() => setActiveTab(t)}
                    >
                        {t.label}
                    </div>
                ))}
            </div>

            <div className="simple-tabs-body-container">
                {activeTab.component}
            </div>
        </div>
    );
};
