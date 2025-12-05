import { useSelector, useDispatch } from "react-redux";
import "./index.scss";
import { Save } from "lucide-react";
import { RootState } from "@/store";
import { useEffect, useState } from "react";
import { createTextField, updateTextField } from "@/features/Fields/services/api";
import { clearDataBucket } from "@/store/ItemsBucketSlice";
import { useQueryClient } from "@tanstack/react-query";

export const SaveBtn = ({ onClickFn }: { onClickFn: any }) => {
    const [active, setActive] = useState(false);
    const [saving, setSaving] = useState(false);
    const dispatch = useDispatch();
    const queryClient = useQueryClient();

    const { dataBucket } = useSelector((state: RootState) => state.itemsBucket);

    useEffect(() => {
        setActive(Object.keys(dataBucket).length > 0);
    }, [dataBucket]);

    const saveSectionFields = async (sections: Record<string, Record<string, any>>) => {
        setSaving(true);
        
        try {
            const sectionIds: string[] = [];
            
            for (const sectionId in sections) {
                sectionIds.push(sectionId);
                const fields = sections[sectionId];

                for (const key in fields) {
                    const field = fields[key];

                    if (field.id) {
                        // Update existing field
                        await updateTextField(field.id, {
                            name: field.name,
                            value: field.value,
                        });
                    } else {
                        // Create new field
                        await createTextField(sectionId, {
                            name: field.name,
                            value: field.value,
                        });
                    }
                }
            }
            
            // Clear dataBucket after successful save
            for (const sectionId of sectionIds) {
                dispatch(clearDataBucket({ key: sectionId }));
            }
            
            // Invalidate queries to refetch fresh data
            for (const sectionId of sectionIds) {
                queryClient.invalidateQueries({ queryKey: [sectionId, "sections"] });
            }
            
            onClickFn?.();
        } catch (error) {
            console.error("Error saving fields:", error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <button
            className={`btn with-icon btn-secondary btn-lg save-btn ${active ? "active" : ""}`}
            onClick={() => saveSectionFields(dataBucket)}
            disabled={saving || !active}
        >
            <Save size={18} />
            <div>{saving ? "Saving..." : "Save"}</div>
        </button>
    );
};
