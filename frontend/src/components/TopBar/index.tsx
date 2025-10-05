import { useDispatch, useSelector } from "react-redux";
import "./index.scss";

import { PanelLeft } from "lucide-react";
import { RootState } from "@/store";
import { toggleSideBar } from "@/store/SideBarSlice";

export const TopBar = () => {
    const { active } = useSelector((state: RootState) => state.sideBarSlice);

    const dispatch = useDispatch();

    function handleToggleSideBar() {
        dispatch(toggleSideBar(!active));
    }

    console.log(active, "active");

    return (
        <div className="topbar-cotainer">
            <div className="topbar-wrapper">
                <div
                    className="sidebar-toggle-btn"
                    onClick={handleToggleSideBar}
                >
                    <PanelLeft size={18} />
                </div>
            </div>
        </div>
    );
};
