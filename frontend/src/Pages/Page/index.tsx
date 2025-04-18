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

// some
export const Page = () => {
    const { page_id } = useParams();
    const [openSideBar, setOpenSideBar] = useState(false);
    const [parentCollectionId, setParentCollectionId] = useState(null);
    const [localFields, setLocalFields] = useState([]);

    const [sideBarComponent, setSideBarComponent] = useState<
        string | undefined
    >();

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

    // to reset the SideBar component type when the side is closed
    useEffect(() => {
        if (!openSideBar) {
            setSideBarComponent(undefined);
        }
    }, [openSideBar]);

    if (!pageData) {
        return <div>Loading...</div>;
    }

    console.log(sideBarComponent, "sideBarComponent");

    return (
        <div className="page-content-container">
            <PageIntro
                data={pageData}
                openSideBar={openSideBar}
                setOpenSideBar={setOpenSideBar}
                setSideBarComponent={setSideBarComponent}
                sideBarComponent={sideBarComponent}
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
            </div>
        </div>
    );
};
