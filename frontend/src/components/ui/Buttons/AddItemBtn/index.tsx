import "./index.scss";
import { Plus } from "lucide-react";

export const AddItemBtn = ({ onClickFn }: { onClickFn: any }) => {
    return (
        <button
            className="btn btn-primary bg-white btn-lg"
            onClick={() => onClickFn()}
        >
            <Plus size={18} />
            <div>Item</div>
        </button>
    );
};
