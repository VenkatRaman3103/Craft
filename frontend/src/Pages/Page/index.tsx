import { Blocks } from "@/Components/Blocks";
import { PageIntro } from "@/Components/PageIntro";
import { backendUrl } from "@/config";
import { pageType } from "@/Types/blocks";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import "./index.scss";
import { Explorer } from "@/Components/Explorer";

export const Page = () => {
    const { page_id } = useParams();
    const [pageData, setPageData] = useState<pageType>();
    const [openSideBar, setOpenSideBar] = useState(false);

    useEffect(() => {
        async function getPageData() {
            const response = await axios.get(`${backendUrl}/pages/${page_id}`);
            setPageData(response.data);
        }
        getPageData();
    }, [page_id]);

    console.log(pageData, "pageData");

    return (
        <Explorer>
            <div className="page-content-container">
                <PageIntro
                    data={pageData}
                    openSideBar={openSideBar}
                    setOpenSideBar={setOpenSideBar}
                />
                <div className="blocks-list-container">
                    {pageData && <Blocks blocks={pageData.blocks} />}

                    {openSideBar && (
                        <div className="sidebar-container">
                            <div className="sidebar-wrapper"></div>
                        </div>
                    )}
                </div>
            </div>
        </Explorer>
    );
};
