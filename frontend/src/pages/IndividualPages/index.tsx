import { PageHeader } from "@/features/Pages/components/PageHeader";
import { getPageByPageId } from "@/features/Pages/service/api";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import "./index.scss";
import { InforStrip } from "@/features/Pages/components/InforStrip";
import { RenderModal } from "@/features/Modals/RenderModal";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useState } from "react";
import { PageItems } from "@/features/Pages/components/PageItems";

export const IndividualPages = () => {
    const { type: modalType, active: isModalActive } = useSelector(
        (state: RootState) => state.modalSlice,
    );

    const [toggleSideBar, setToggleSideBar] = useState(false);

    const { page_id } = useParams();

    const { data: pageData } = useQuery({
        queryFn: () => getPageByPageId(page_id),
        queryKey: ["page", page_id],
    });

    if (!pageData) {
        return <div>Loading page data</div>;
    }

    console.log(pageData, "pageData");
    console.log(isModalActive, "isModalActive");

    return (
        <>
            <div className="page">
                <PageHeader data={pageData} />
            </div>
            <InforStrip
                updatedAt={pageData.updated_at}
                createdAt={pageData.created_at}
                toggleSideBar={toggleSideBar}
                setToggleSideBar={setToggleSideBar}
            />
            <div className="page ind-page-content">
                <div className="page-content-area">
                    <PageItems items={pageData.items} />
                </div>

                {toggleSideBar && <div className="page-sidebar"></div>}
            </div>
            {isModalActive && <RenderModal type={modalType} />}
        </>
    );
};
