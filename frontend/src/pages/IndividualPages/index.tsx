import { PageHeader } from "@/features/Pages/components/PageHeader";
import { getPageByPageId } from "@/features/Pages/service/api";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import "./index.scss";
import { InforStrip } from "@/features/Pages/components/InforStrip";
import { AddBtn } from "@/components/ui/Buttons/AddBtn";
import { RenderModal } from "@/features/Modals/RenderModal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { updateModalType } from "@/store/ModalSlice";

export const IndividualPages = () => {
    const { type: modalType } = useSelector(
        (state: RootState) => state.modalSlice,
    );

    const dispatch = useDispatch();

    const { page_id } = useParams();

    const { data: pageData } = useQuery({
        queryFn: () => getPageByPageId(page_id),
        queryKey: ["page", page_id],
    });

    console.log(pageData, "pageData");

    if (!pageData) {
        return <div>Loading page data</div>;
    }

    function handleToggleModal(type: string) {
        dispatch(updateModalType(type));
    }

    console.log(modalType);

    return (
        <>
            <div className="page">{<PageHeader data={pageData} />}</div>
            <InforStrip
                updatedAt={pageData.updated_at}
                createdAt={pageData.created_at}
            />
            <div className="page page-content">
                <AddBtn onClickFn={() => handleToggleModal("page-items")} />
            </div>
            <RenderModal type={modalType} />
        </>
    );
};
