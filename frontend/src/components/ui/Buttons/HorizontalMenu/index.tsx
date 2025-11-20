import "./index.scss";
import { Plus } from "lucide-react";

export const HorizontalMenu = ({ onClickFn }: { onClickFn: any }) => {
    return (
        <button className="btn btn-primary btn-sm" onClick={() => onClickFn()}>
            <Plus size={18} />
        </button>
    );
};
