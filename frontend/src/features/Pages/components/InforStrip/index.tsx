import { createContext, useContext } from "react";
import { PanelRight } from "lucide-react";
import "./index.scss";
import { PublishBtn } from "@/components/ui/Buttons/PublishBtn";

const InfoStripContext = createContext(null);

export const InfoStrip = ({ value, onChange, children }) => {
    return (
        <InfoStripContext.Provider value={{ value, onChange }}>
            <div className="info-container">{children}</div>
        </InfoStripContext.Provider>
    );
};

InfoStrip.Tabs = function Tabs({ children }) {
    return <div className="tabs-wrapper">{children}</div>;
};

InfoStrip.Tab = function Tab({ id, children }) {
    const ctx = useContext(InfoStripContext);

    const isActive = ctx.value === id;

    return (
        <div
            className={`tab ${isActive ? "active" : ""}`}
            onClick={() => ctx.onChange(id)}
        >
            {children}
        </div>
    );
};

InfoStrip.SidebarToggle = function SidebarToggle({ open, onToggle }) {
    return (
        <div className={`sidebar-toggle-btn ${open ? "active" : ""}`}>
            <PanelRight size={18} onClick={onToggle} />
        </div>
    );
};

InfoStrip.ActionButtons = function ActionButtons({ onClickfn }) {
    return <PublishBtn onClickFn={onClickfn} />;
};
