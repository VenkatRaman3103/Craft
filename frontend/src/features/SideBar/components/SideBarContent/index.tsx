import { RootState } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { getStructureContent } from "../../services/api/getStructureContent";
import "./index.scss";
import * as LucideIcons from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router";
import { icons_map } from "../../services/data/icons_map";

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

export const NestedList = ({ id, name, type, children }: any) => {
    const hasChildren = children && children.length > 0;
    const [open, setOpen] = useState(true);

    const { pathname } = useLocation();
    const slugs = pathname.split("/");
    const pathnameLenght = slugs.length;
    const elementId = slugs[pathnameLenght - 1];

    const Icon: any = LucideIcons[icons_map[type] as keyof typeof LucideIcons];
    const Chevron = open ? LucideIcons.ChevronDown : LucideIcons.ChevronRight;

    console.log(elementId, pathnameLenght - 1, pathname, "elementId");

    return (
        <div className={`nested-element-wrapper _${type}`}>
            <div
                className={`nested-element ${id == elementId ? "active" : ""}`}
                onClick={() => hasChildren && setOpen(!open)}
                style={{ cursor: hasChildren ? "pointer" : "default" }}
            >
                {hasChildren && <Chevron className="caret-icon" />}
                {Icon && <Icon className="nested-icon" />}
                {name}
            </div>

            {hasChildren && open && (
                <div className="nested-children">
                    {children.map((child: any) => (
                        <NestedList key={child.id} {...child} />
                    ))}
                </div>
            )}
        </div>
    );
};
