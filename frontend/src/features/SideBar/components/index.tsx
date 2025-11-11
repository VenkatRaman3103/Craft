import { useSelector } from "react-redux";
import "./index.scss";
import { RootState } from "@/store";
import { SideBarContent } from "./SideBarContent";
import { SideBarItems } from "./SideBarItems";

export const SideBar = () => {
    const { active } = useSelector((state: RootState) => state.sideBarSlice);

    return (
        <div className={`sidebar-container ${active ? "active" : ""}`}>
            <SideBarItems />
            {active && (
                <div className="sidebar-content">
                    <SideBarContent />
                </div>
            )}
        </div>
    );
};
