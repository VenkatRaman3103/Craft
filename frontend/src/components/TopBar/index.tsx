import "./index.scss";

import { PanelLeft } from "lucide-react";

export const TopBar = () => {
    return (
        <div className="topbar-cotainer">
            <div className="topbar-wrapper">
                <div className="sidebar-toggle-btn">
                    <PanelLeft size={18} />
                </div>
            </div>
        </div>
    );
};
