import { useSelector } from "react-redux";
import "./index.scss";
import { ArrowBigUpDash, Plus, Save } from "lucide-react";
import { RootState } from "@/store";
import { useEffect, useState } from "react";
import { createTextField } from "@/features/Fields/services/api";

export const SaveBtn = ({ onClickFn }: { onClickFn: any }) => {
    const [active, setActive] = useState(false);

    const { dataBucket } = useSelector((state: RootState) => state.itemsBucket);

    useEffect(() => {
        setActive(Object.keys(dataBucket).length > 0);
    }, [dataBucket]);

    const createSectionField = async (sections) => {
        for (const sectionId in sections) {
            const fields = sections[sectionId];

            for (const key in fields) {
                const field = fields[key];

                await createTextField(sectionId, {
                    name: field.name,
                    value: field.value,
                });
            }
        }
    };

    return (
        <button
            className={`btn with-icon btn-secondary btn-lg save-btn ${active ? "active" : ""}`}
            onClick={() => createSectionField(dataBucket)}
        >
            <Save size={18} />
            <div>Save</div>
        </button>
    );
};
