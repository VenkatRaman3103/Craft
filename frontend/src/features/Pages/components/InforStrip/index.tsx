import { DualColorLabel } from "@/components/ui/common/DualColorLabel";
import { PanelRight } from "lucide-react";
import "./index.scss";

export const InforStrip = ({
    updatedAt,
    createdAt,
    toggleSideBar,
    setToggleSideBar,
}) => {
    function handleToggleSideBar() {
        setToggleSideBar(!toggleSideBar);
    }

    return (
        <div className="info-container">
            <div className="info-wrapper">
                <DualColorLabel title="created_at" value={updatedAt} />
                <DualColorLabel title="updated_at" value={createdAt} />
            </div>
            <div className={`sidebar-toggle-btn ${toggleSideBar && "active"}`}>
                <PanelRight size={18} onClick={handleToggleSideBar} />
            </div>
        </div>
    );
};
