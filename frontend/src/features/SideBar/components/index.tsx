import { useDispatch, useSelector } from "react-redux";
import "./index.scss";
import { RootState } from "@/store";
import * as LucideIcons from "lucide-react";
import { sidebar_items } from "../sidebar_items";
import { toggleSideBar, updateActiveLayer } from "@/store/SideBarSlice";

export const SideBar = () => {
    const { active, activeLayer } = useSelector(
        (state: RootState) => state.sideBarSlice,
    );

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
            {active && <div className="sidebar-content"></div>}
        </div>
    );
};
