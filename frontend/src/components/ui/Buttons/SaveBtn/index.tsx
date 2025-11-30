import "./index.scss";
import { ArrowBigUpDash, Plus, Save } from "lucide-react";

export const SaveBtn = ({ onClickFn }: { onClickFn: any }) => {
    return (
        <button
            className="btn with-icon btn-secondary  btn-lg"
            onClick={() => onClickFn()}
        >
            <Save size={18} />
            <div>Save</div>
        </button>
    );
};
