import { ReactNode } from "react";
import { useDeleteSection } from "../service/mutation";
import { Clipboard, Copy, Pencil, Trash } from "lucide-react";

type optionType = {
    label: string;
    name: string;
    func: () => any;
    icon: ReactNode;
};

export const useDropDownMenuOptions = (id, page_id): optionType[] => {
    const deleteSection = useDeleteSection(id, page_id);

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
            func: () => deleteSection.mutate(),
        },
    ];
};
