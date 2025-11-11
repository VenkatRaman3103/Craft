import { useDispatch, useSelector } from "react-redux";
import "./index.scss";
import { RootState } from "@/store";
import * as LucideIcons from "lucide-react";
import { sidebar_items } from "../sidebar_items";
import { toggleSideBar, updateActiveLayer } from "@/store/SideBarSlice";
import { SideBarContent } from "./SideBarContent";

export const SideBar = () => {
    const { active, activeLayer } = useSelector(
        (state: RootState) => state.sideBarSlice,
    );

    function handleToggleSideBar() {
        dispatch(toggleSideBar(!active));
    }

    console.log(active, "active");

    const dispatch = useDispatch();

    function handleLayerSelection(layer: string) {
        dispatch(updateActiveLayer(layer));

        if (activeLayer == layer) {
            if (active == false) {
                dispatch(toggleSideBar(true));
            } else if (active == true) {
                dispatch(toggleSideBar(false));
            }
        } else {
            dispatch(toggleSideBar(true));
        }
    }

    return (
        <div className={`sidebar-container ${active ? "active" : ""}`}>
            <div className="sidebar-wrapper">
                <div
                    className="sidebar-toggle-btn"
                    onClick={handleToggleSideBar}
                >
                    <LucideIcons.PanelLeft size={18} />
                </div>
                {sidebar_items.map((item: any) => {
                    const Icon: any =
                        LucideIcons[item.icon as keyof typeof LucideIcons];
                    return (
                        <div
                            key={item.name}
                            className={`sidebar-item ${activeLayer === item.name ? "active" : ""}`}
                            onClick={() => handleLayerSelection(item.name)}
                        >
                            <Icon size={20} />
                        </div>
                    );
                })}
            </div>
            {active && (
                <div className="sidebar-content">
                    <SideBarContent />
                </div>
            )}
        </div>
    );
};
