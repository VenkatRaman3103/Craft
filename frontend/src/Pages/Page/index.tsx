import { Blocks } from "@/Components/Blocks";
import { PageIntro } from "@/Components/PageIntro";
import { backendUrl } from "@/config";
import { pageType } from "@/Types/blocks";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import "./index.scss";
import { AddBtn } from "@/Components/Buttons/AddBtn";

export const Page = () => {
    const { page_id } = useParams();
    const [pageData, setPageData] = useState<pageType>();
    const [openSideBar, setOpenSideBar] = useState(false);
    const [blocks, setBlocks] = useState();

    useEffect(() => {
        async function getPageData() {
            const response = await axios.get(`${backendUrl}/pages/${page_id}`);
            setPageData(response.data);
        }
        getPageData();
    }, [page_id]);

    useEffect(() => {
        if (pageData) {
            setBlocks(pageData.blocks);
        }
    }, [pageData]);

    console.log(pageData, "pageData");

    return (
        <div className="page-content-container">
            <PageIntro
                data={pageData}
                openSideBar={openSideBar}
                setOpenSideBar={setOpenSideBar}
            />
            <div className="blocks-list-container">
                <div className="blocks-list-wrapper">
                    {blocks && <Blocks blocks={blocks} />}
                    <div
                        className="add-blocks-btn-wrapper"
                        onClick={() => setBlocks([...blocks, {}])}
                    >
                        <AddBtn iconLable="Add Block" />
                    </div>
                </div>

                {openSideBar && (
                    <div className="sidebar-container">
                        <div className="sidebar-wrapper"></div>
                    </div>
                )}
            </div>
        </div>
    );
};
