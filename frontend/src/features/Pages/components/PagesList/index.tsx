import { RootState } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { getPagesByElementId } from "../../service/api";
import "./index.scss";
import { PagePreview } from "../PagePreview";
import { SearchBar } from "@/components/SearchBar";
import { NewPage } from "@/components/ActionButtons/NewPage";

export const PagesList = () => {
    const { activeElementId } = useSelector(
        (state: RootState) => state.elementSlice,
    );

    const { data: pagesData } = useQuery({
        queryFn: () => getPagesByElementId(activeElementId),
        queryKey: [activeElementId, "pages"],
    });

    return (
        <div className="pages-list-container">
            <div className="action-buttons">
                <SearchBar />
                {/* <div className="filter-button">filter button</div> */}
                {/* <div className="columns-button">columns button</div> */}
                <NewPage />
            </div>
            <div className="pages-list">
                {/* TODO: add loading UI*/}
                {!pagesData && <div>loading...</div>}
                {/* TODO: add no item found UI*/}
                {pagesData?.length === 0 && <div>no pages found</div>}
                {pagesData?.map((page: any) => (
                    <PagePreview page={page} />
                ))}
            </div>
        </div>
    );
};
