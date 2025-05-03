import { PageIntro } from "@/Components/PageIntro";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import "./index.scss";
import { fetchPageData } from "./api";
import axios from "axios";
import { backendUrl } from "@/config";
import { FieldsAndBlocksList } from "@/Components/FieldsAndBlocksList";
import { SideBar } from "@/Components/SideBar";
import { ApiViewer } from "@/Components/ApiViewer";

export const Page = () => {
    const { page_id } = useParams();
    const [openSideBar, setOpenSideBar] = useState(false);
    const [parentCollectionId, setParentCollectionId] = useState(null);
    const [localFields, setLocalFields] = useState([]);

    const [sideBarComponent, setSideBarComponent] = useState<
        string | undefined
    >();
    const [openApiPreview, setOpenApiPreview] = useState<boolean>(false);

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

        async function getLocalFields() {
            const response = await axios.get(
                `${backendUrl}/collections/collectionItems/${parentCollectionId}`,
            );

            setLocalFields(response.data.collection_items);
        }

        if (parentCollectionId) {
            getLocalFields();
        }
    }, [pageData, parentCollectionId]);

    useEffect(() => {
        if (!openSideBar) {
            setSideBarComponent(undefined);
        }
    }, [openSideBar]);

    if (!pageData) {
        return <div>Loading...</div>;
    }

    console.log(sideBarComponent, "sideBarComponent");
    console.log(pageData, "pageData");

    return (
        <div className="page-content-container">
            <PageIntro
                data={pageData}
                openSideBar={openSideBar}
                setOpenSideBar={setOpenSideBar}
                setSideBarComponent={setSideBarComponent}
                sideBarComponent={sideBarComponent}
                setOpenApiPreview={setOpenApiPreview}
                openApiPreview={openApiPreview}
            />
            <div className="wrapper">
                <FieldsAndBlocksList
                    itemsList={pageData.page_items}
                    query_key_id={page_id}
                    parentCollectionId={parentCollectionId}
                    queryKey={["pageData", page_id]}
                    itemType="page"
                    localFields={localFields}
                />

                <div
                    className={`sidebar-container ${openSideBar ? "open" : ""}`}
                >
                    {openSideBar && (
                        <div className="sidebar-wrapper">
                            <SideBar type={sideBarComponent} />
                        </div>
                    )}
                </div>

                <div
                    className={`api-container ${openApiPreview ? "expand" : ""}`}
                >
                    {openApiPreview && (
                        <div className={`api-wrapper`}>
                            <ApiViewer />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
