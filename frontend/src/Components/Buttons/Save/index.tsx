import { lightFont } from "@/Styles/base";
import { ArrowDownToLine } from "lucide-react";
import "./index.scss";

export const Save = () => {
    return (
        <div className="save-btn">
            <ArrowDownToLine size={18} color={lightFont} />
            <div className="save-btn-text">Save</div>
        </div>
    );
};
