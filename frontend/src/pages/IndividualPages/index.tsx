import { PageHeader } from "@/features/Pages/components/PageHeader";
import { getPageByPageId } from "@/features/Pages/service/api";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import "./index.scss";
import { InfoStrip } from "@/features/Pages/components/InforStrip";
import { RenderModal } from "@/features/Modals/RenderModal";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useState } from "react";
import { PageItems } from "@/features/Pages/components/PageItems";
import { PageSideBar, SideBar } from "@/features/Pages/components/PageSideBar";

export const IndividualPages = () => {
    const { type: modalType, active: isModalActive } = useSelector(
        (state: RootState) => state.modalSlice,
    );

    const tab_items = ["edit", "table", "api"];

    const [activeTab, setActiveTab] = useState(tab_items[0]);

    const [toggleSideBar, setToggleSideBar] = useState(false);

    const { page_id } = useParams();

    const { data: pageData } = useQuery({
        queryFn: () => getPageByPageId(page_id),
        queryKey: ["page", page_id],
    });

    if (!pageData) {
        return <div>Loading page data</div>;
    }

    console.log(activeTab, "activeTab");

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
                </InfoStrip.Tabs>

                <InfoStrip.SidebarToggle
                    open={toggleSideBar}
                    onToggle={() => setToggleSideBar(!toggleSideBar)}
                />
            </InfoStrip>
            <div className="page ind-page-content">
                <div className="page-content-area">
                    <PageItems
                        items={pageData.items.filter(
                            (item) => item.position == "content",
                        )}
                    />
                </div>

                {toggleSideBar && (
                    <PageSideBar
                        items={pageData.items.filter(
                            (item) => item.position == "sidebar",
                        )}
                    />
                )}
            </div>
            {isModalActive && <RenderModal type={modalType} />}
        </>
    );
};
