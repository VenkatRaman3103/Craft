import "./index.scss";
import { ArrowBigUpDash, Plus } from "lucide-react";

export const CommitBtn = ({ onClickFn }: { onClickFn: any }) => {
    return (
        <button
            className="btn with-icon btn-primary  btn-lg"
            onClick={() => onClickFn()}
        >
            <ArrowBigUpDash size={18} />
            <div>Commit</div>
        </button>
    );
};
