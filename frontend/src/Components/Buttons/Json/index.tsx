import { lightFont } from "@/Styles/base";
import { FileJson2 } from "lucide-react";
import "./index.scss";

export const Json = () => {
    return (
        <div className="json-object-btn">
            <FileJson2 size={18} color={lightFont} />
            <div className="json-object-btn-text">JSON</div>
        </div>
    );
};
