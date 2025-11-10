import { RootState } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { getStructureContent } from "../../services/api/getStructureContent";
import "./index.scss";
import { icons_map } from "./icons_map";
import * as LucideIcons from "lucide-react";

export const SideBarContent = () => {
    const { activeLayer } = useSelector(
        (state: RootState) => state.sideBarSlice,
    );

    const { data: structuredContent } = useQuery({
        queryFn: () => getStructureContent(),
        queryKey: ["structured-content"],
    });

    console.log(structuredContent, "structuredContent");

    if (!structuredContent) {
        return <></>;
    }

    return (
        <div className="sidebar-content-container">
            <div className="sidebar-content-header">{activeLayer}</div>
            <div className="sidebar-content-wrapper">
                {structuredContent.map((element: any) => (
                    <NestedList {...element} />
                ))}
            </div>
        </div>
    );
};

export const NestedList = ({ name, type, children }: any) => {
    const hasChildren = children && children.length > 0;
    const Icon: any = LucideIcons[icons_map[type] as keyof typeof LucideIcons];

    console.log(Icon, "Icon");

    return (
        <div className={`nested-element-wrapper _${type}`}>
            <div className="nested-element">
                {Icon && <Icon className="nested-icon" />}
                {name}
            </div>
            {hasChildren &&
                children.map((child: any) => (
                    <NestedList key={child.id} {...child} />
                ))}
        </div>
    );
};
