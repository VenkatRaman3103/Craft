import "./index.scss";
import { Plus } from "lucide-react";

export const AddItemBtn = ({ onClickFn }: { onClickFn: any }) => {
    return (
        <button
            className="btn with-icon btn-primary  btn-lg"
            onClick={() => onClickFn()}
        >
            <Plus size={18} />
            <div>Item</div>
        </button>
    );
};
