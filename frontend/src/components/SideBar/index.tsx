import { useSelector } from "react-redux";
import "./index.scss";
import { RootState } from "@/store";
import * as LucideIcons from "lucide-react";
import { sidebar_items } from "./sidebar_items";
import { useState } from "react";

export const SideBar = () => {
    const { active } = useSelector((state: RootState) => state.sideBarSlice);

    const [activeElement, setActiveElement] = useState();

    return (
        <div className={`sidebar-container ${active ? "active" : ""}`}>
            <div className="sidebar-wrapper">
                {sidebar_items.map((item: any) => {
                    const Icon: any =
                        LucideIcons[item.icon as keyof typeof LucideIcons];
                    return (
                        <div
                            key={item.name}
                            className={`sidebar-item ${activeElement === item.name ? "active" : ""}`}
                            onClick={() => setActiveElement(item.name)}
                        >
                            <Icon size={20} />
                        </div>
                    );
                })}
            </div>
            {active && <div className="sidebar-content"></div>}
        </div>
    );
};
