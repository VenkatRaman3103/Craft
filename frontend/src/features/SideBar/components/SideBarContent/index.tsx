import { RootState } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { getStructureContent } from "../../services/api/getStructureContent";

export const SideBarContent = () => {
    const { activeLayer } = useSelector(
        (state: RootState) => state.sideBarSlice,
    );

    const { data: structuredContent } = useQuery({
        queryFn: () => getStructureContent(),
        queryKey: ["structured-content"],
    });

    console.log(structuredContent, "structuredContent");

    return (
        <div>
            <div>{activeLayer}</div>
        </div>
    );
};
