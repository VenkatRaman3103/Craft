import { RootState } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { getPagesByElementId } from "../../service/api";
import "./index.scss";
import { PagePreview } from "../PagePreview";
import { ContentHeader } from "@/components/ContentHeader";

export const PagesList = () => {
    const { activeElementId } = useSelector(
        (state: RootState) => state.elementSlice,
    );

    const { data: pagesData } = useQuery({
        queryFn: () => getPagesByElementId(activeElementId),
        queryKey: [activeElementId, "pages"],
    });

    console.log(pagesData, "pagesData");

    return (
        <div className="pages-list-container">
            <ContentHeader />
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
