import { ReactNode } from "react";
import { useDeleteField } from "../service/mutation";
import { Clipboard, Copy, Pencil, Trash } from "lucide-react";

type optionType = {
    label: string;
    name: string;
    func: () => any;
    icon: ReactNode;
};

export const useOverFlowMenu = (
    field_type: string,
    field_id: string,
    reference_id: string,
): optionType[] => {
    const deleteField = useDeleteField(field_type, field_id, reference_id);

    return [
        {
            label: "copy fields",
            icon: <Copy size={18} />,
            name: "copy",
            func: () => {},
        },
        {
            label: "paste fields",
            icon: <Clipboard size={18} />,
            name: "copy",
            func: () => {},
        },
        {
            label: "edit",
            icon: <Pencil size={18} />,
            name: "copy",
            func: () => {},
        },
        {
            label: "delete",
            name: "delete",
            icon: <Trash size={18} />,
            func: () => deleteField.mutate(),
        },
    ];
};
