import { CollectionIntro } from "@/Components/CollectionIntro";
import { backendUrl } from "@/config";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import "./index.scss";
import { pageType } from "@/Types/blocks";
import { v4 as uuidv4 } from "uuid";
import * as React from "react";

export const Collection = () => {
    const { collection_id } = useParams();
    const [pagesList, setPagesList] = useState<pageType[]>();
    const [showAddPage, setShowAddPage] = useState(false);

    const options = ["Pages", "Components", "Fields"];
    const [selectedOption, setSelectedOption] = useState(options[0]);

    useEffect(() => {
        async function getPages() {
            const response = await axios.get(
                `${backendUrl}/collection/${collection_id}`,
            );

            setPagesList(response.data);
        }
        getPages();
    }, [collection_id]);

    console.log(pagesList, "pagesList");

    function handleDeletePage(page_id: string) {
        try {
            const response = axios.delete(`${backendUrl}/pages/${page_id}`);
            console.log(response, `successfully deleted the page ${page_id}`);
        } catch (error) {
            console.log("frontend - error in deleting the page:", error);
        }

        setPagesList((prev) =>
            prev?.filter((item) => item.pages.page_id !== page_id),
        );
    }

    return (
        <div className="collection-pages-container">
            <div className="collection-pages-wrapper">
                {pagesList && (
                    <CollectionIntro
                        collection={pagesList[0]?.collections}
                        collection_id={pagesList[0]?.collections.collection_id}
                        showNavBtn={false}
                    />
                )}

                <div className="view-options-container">
                    {/* <div className="view-options-wrapper"> */}
                    {options.map((item, ind) => (
                        <div
                            key={ind}
                            className={`options ${selectedOption == item ? "active" : ""}`}
                            onClick={() => setSelectedOption(item)}
                        >
                            {item}
                        </div>
                    ))}
                    {/* </div> */}
                </div>
                {/* TODO: filters */}
                {/* TODO: pages */}
                {/* TODO: components */}
                {/* TODO: fields */}
                {selectedOption == "Pages" && (
                    <div className="pages-list-container">
                        <div className="pages-list-wrapper">
                            {pagesList?.map((item: pageType, ind: number) => (
                                <PagePreview
                                    key={ind}
                                    page={item.pages}
                                    deletePage={handleDeletePage}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {showAddPage && (
                    <AddPage
                        slug={pagesList[0]?.collections.slug}
                        collection_id={pagesList[0]?.collections.collection_id}
                        setPagesList={setPagesList}
                        setShowAddPage={setShowAddPage}
                    />
                )}
                <button
                    className="add-page-btn"
                    onClick={() => setShowAddPage(true)}
                >
                    Add Page
                </button>
            </div>
        </div>
    );
};

export const AddPage = ({
    slug,
    collection_id,
    setPagesList,
    setShowAddPage,
}: {
    slug: string;
    collection_id: string;
    setPagesList: React.Dispatch<React.SetStateAction<pageType[]>>;
    setShowAddPage: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const [pageTitle, setPageTitle] = useState<string>();
    const page_id = uuidv4();

    async function handleSave() {
        const newPage = {
            title: pageTitle,
            slug: slug,
            page_id,
        };

        await axios.post(`${backendUrl}/pages`, newPage);
        await axios.post(`${backendUrl}/collection-page`, {
            collection_id,
            page_id,
        });

        setPagesList((prev: pageType) => [...(prev || []), { pages: newPage }]);
        setShowAddPage(false);
    }

    return (
        <div className="page-container">
            <div className="page-wrapper">
                <div className="page-image-wrapper">
                    <div className="page-image"></div>
                </div>
                <div className="collection-content-container">
                    <div className="collection-content-wrapper">
                        <input
                            type="text"
                            value={pageTitle}
                            placeholder="Page Title"
                            onChange={(e) => setPageTitle(e.target.value)}
                            className="heading"
                        />
                        <button className="go-to-page-btn" onClick={handleSave}>
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const PagePreview = ({ page, deletePage }: { page: pageType }) => {
    const navigate = useNavigate();

    function handleOpenPage(page_id: string) {
        navigate(`/pages/${page_id}`);
    }

    return (
        <div className="page-container">
            <div className="page-wrapper">
                <div className="page-image-wrapper">
                    <div className="page-image"></div>
                </div>
                <div className="collection-content-container">
                    <div className="collection-content-wrapper">
                        <div className="heading">{page?.title}</div>
                        <button
                            className="go-to-page-btn"
                            onClick={() => handleOpenPage(page.page_id)}
                        >
                            Open Page
                        </button>
                        <button
                            className="go-to-page-btn"
                            onClick={() => deletePage(page.page_id)}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
