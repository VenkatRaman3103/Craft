import { Blocks } from "@/Components/Blocks";
import { PageIntro } from "@/Components/PageIntro";
import { backendUrl } from "@/config";
import { pageType } from "@/Types/blocks";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import "./index.scss";

export const Page = () => {
    const { page_id } = useParams();
    const [pageData, setPageData] = useState<pageType>();

    useEffect(() => {
        async function getPageData() {
            const response = await axios.get(`${backendUrl}/pages/${page_id}`);
            setPageData(response.data);
        }
        getPageData();
    }, [page_id]);

    console.log(pageData, "pageData");

    return (
        <div>
            <PageIntro data={pageData} />
            <div className="page-content-container">
                <div className="blocks-list-container">
                    {pageData && (
                        <div>
                            <Blocks blocks={pageData.blocks} />
                        </div>
                    )}
                </div>
                {/* <div className="sidebar-container"> */}
                {/*     <div className="sidebar-wrapper"></div> */}
                {/* </div> */}
            </div>
        </div>
    );
};
