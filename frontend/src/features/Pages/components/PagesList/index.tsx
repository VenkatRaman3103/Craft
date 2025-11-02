import { AddBtn } from "@/components/ui/Buttons/AddBtn";
import { RootState } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { getPagesByElementId } from "../../service/api";

export const PagesList = () => {
    const { activeElementId } = useSelector(
        (state: RootState) => state.elementSlice,
    );

    const { data } = useQuery({
        queryFn: () => getPagesByElementId(activeElementId),
        queryKey: [activeElementId, "pages"],
    });

    console.log(data, activeElementId, "pages data");

    return (
        <div className="pages-list-container">
            <div className="action-buttons">
                <div className="search-bar">search bar</div>
                <div className="filter-button">filter button</div>
                <div className="columns-button">columns button</div>
                <AddBtn />
            </div>
            <div className="pages-list"></div>
        </div>
    );
};
