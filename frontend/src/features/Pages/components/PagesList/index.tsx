import { RootState } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { getPagesByElementId } from "../../service/api";
import "./index.scss";
import { PagePreview } from "../PagePreview";
import { SearchBar } from "@/components/SearchBar";
import { NewPage } from "@/components/ActionButtons/NewPage";
import { NewCollection } from "@/components/ActionButtons/NewCollection";

export const PagesList = () => {
    const { activeElementId, activeElementType } = useSelector(
        (state: RootState) => state.elementSlice,
    );

    const { data: pagesData } = useQuery({
        queryFn: () => getPagesByElementId(activeElementId),
        queryKey: [activeElementId, "pages"],
    });

    console.log(activeElementType, "activeElementType");

    return (
        <div className="pages-list-container">
            <div className="action-buttons">
                <SearchBar />
                {/* <div className="filter-button">filter button</div> */}
                {/* <div className="columns-button">columns button</div> */}
                <NewContent />
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

export const NewContent = () => {
    const { activeElementId, activeElementType } = useSelector(
        (state: RootState) => state.elementSlice,
    );

    function renderNewContentButton(type: any) {
        switch (type) {
            case "page":
                return <NewPage />;
            case "collection":
                return (
                    <NewCollection
                        referenceId={activeElementId}
                        parentType={"element"}
                    />
                );
        }
    }

    // NewCollection
    return <>{renderNewContentButton(activeElementType)}</>;
};
