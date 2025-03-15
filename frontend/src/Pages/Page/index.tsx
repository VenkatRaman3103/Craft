import { PageIntro } from "@/Components/PageIntro";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import "./index.scss";
import { AddBtn } from "@/Components/Buttons/AddBtn";
import { fetchPageData } from "./api";
import axios from "axios";
import { backendUrl } from "@/config";
import { FieldsAndBlocksList } from "@/Components/FieldsAndBlocksList";

export const Page = () => {
    const { page_id } = useParams();
    const [openSideBar, setOpenSideBar] = useState(false);
    const [parentCollectionId, setParentCollectionId] = useState(null);

    const { data: pageData } = useQuery({
        queryKey: ["pageData", page_id],
        queryFn: () => fetchPageData(page_id),
        enabled: !!page_id,
    });

    useEffect(() => {
        async function fetchParentCollection() {
            const response = await axios.get(
                `${backendUrl}/collection_page/${pageData.page_id}`,
            );

            setParentCollectionId(response.data.collection_ref_id);
        }

        if (pageData) {
            fetchParentCollection();
        }
    }, [pageData]);

    if (!pageData) {
        return <div>Loading...</div>;
    }

    console.log("openSideBar", openSideBar);
    console.log(pageData.page_items, "pageData");

    return (
        <div className="page-content-container">
            <PageIntro
                data={pageData}
                openSideBar={openSideBar}
                setOpenSideBar={setOpenSideBar}
            />
            <div className="wrapper">
                <FieldsAndBlocksList
                    itemsList={pageData.page_items}
                    query_key_id={page_id}
                    parentCollectionId={parentCollectionId}
                    queryKey={["pageData", page_id]}
                    itemType="page"
                />

                <div
                    className={`sidebar-container ${openSideBar ? "open" : ""}`}
                >
                    <div className="sidebar-wrapper"></div>
                </div>
            </div>
        </div>
    );
};
