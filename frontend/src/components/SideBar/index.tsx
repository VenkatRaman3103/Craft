import { useSelector } from "react-redux";
import "./index.scss";
import { RootState } from "@/store";

export const SideBar = () => {
    const { active } = useSelector((state: RootState) => state.sideBarSlice);

    return (
        <div className={`sidebar-container ${active ? "active" : ""}`}>
            <div className="sidebar-wrapper"></div>
        </div>
    );
};
