import { useDispatch, useSelector } from "react-redux";
import "./index.scss";

import { PanelLeft } from "lucide-react";
import { RootState } from "@/store";
import { toggleSideBar } from "@/store/SideBarSlice";

export const TopBar = () => {
    return (
        <div className="topbar-cotainer">
            <div className="topbar-wrapper"></div>
        </div>
    );
};
