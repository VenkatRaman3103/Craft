import { useSelector } from "react-redux";
import "./index.scss";
import { ArrowBigUpDash, Plus, Save } from "lucide-react";
import { RootState } from "@/store";
import { useEffect, useState } from "react";

export const SaveBtn = ({ onClickFn }: { onClickFn: any }) => {
    const [active, setActive] = useState(false);

    const { dataBucket } = useSelector((state: RootState) => state.itemsBucket);

    useEffect(() => {
        setActive(Object.keys(dataBucket).length > 0);
    }, [dataBucket]);

    return (
        <button
            className={`btn with-icon btn-secondary btn-lg save-btn ${active ? "active" : ""}`}
            onClick={() => onClickFn()}
        >
            <Save size={18} />
            <div>Save</div>
        </button>
    );
};
