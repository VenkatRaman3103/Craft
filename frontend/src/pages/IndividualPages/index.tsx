import { PageHeader } from "@/features/Pages/components/PageHeader";
import { getPageByPageId } from "@/features/Pages/service/api";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import "./index.scss";
import { InfoStrip } from "@/features/Pages/components/InforStrip";
import { RenderModal } from "@/features/Modals/RenderModal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { useEffect, useState } from "react";
import { PageItems } from "@/features/Pages/components/PageItems";
import { PageSideBar, SideBar } from "@/features/Pages/components/PageSideBar";
import { updatePageData } from "@/store/PageSlice";
import { EditorPanel } from "@/features/Pages/components/EditorPanel";
import { VersionsPanel } from "@/features/Pages/components/VersionsPanel";

export const IndividualPages = () => {
    const { type: modalType, active: isModalActive } = useSelector(
        (state: RootState) => state.modalSlice,
    );

    const dispatch = useDispatch();

    const tab_items = ["edit", "table", "api", "versions"];

    const [activeTab, setActiveTab] = useState(tab_items[0]);

    const { page_id } = useParams();

    const { data: pageData } = useQuery({
        queryFn: () => getPageByPageId(page_id),
        queryKey: ["page", page_id],
    });

    useEffect(() => {
        if (pageData) {
            dispatch(updatePageData(pageData));
        }
    }, [pageData]);

    if (!pageData) {
        return <div>Loading page data</div>;
    }

    console.log(activeTab, "activeTab");

    function renderTabsContent(tab) {
        switch (tab) {
            case "edit":
                return <EditorPanel />;

            case "versions":
                return <VersionsPanel />;
        }
    }

    return (
        <>
            <div className="page">
                <PageHeader data={pageData} />
            </div>
            <InfoStrip value={activeTab} onChange={setActiveTab}>
                <InfoStrip.Tabs>
                    <InfoStrip.Tab id="edit">Edit</InfoStrip.Tab>
                    <InfoStrip.Tab id="table">Table</InfoStrip.Tab>
                    <InfoStrip.Tab id="api">API</InfoStrip.Tab>
                    <InfoStrip.Tab id="versions">Versions</InfoStrip.Tab>
                </InfoStrip.Tabs>
                <InfoStrip.ActionButtons />
            </InfoStrip>
            <div className="page ind-page-content">
                {renderTabsContent(activeTab)}
            </div>
            {isModalActive && <RenderModal type={modalType} />}
        </>
    );
};
