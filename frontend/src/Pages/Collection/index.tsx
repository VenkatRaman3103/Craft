import { CollectionIntro } from "@/Components/CollectionIntro";
import { backendUrl } from "@/config";
import axios from "axios";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import "./index.scss";
import { pageType } from "@/Types/blocks";
import { v4 as uuidv4 } from "uuid";
import * as React from "react";
import { FieldsAndBlocksList } from "@/Components/FieldsAndBlocksList";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const Collection = () => {
    const { collection_id } = useParams();
    const queryClient = useQueryClient();

    const { data: collectionData, isLoading } = useQuery({
        queryKey: ["collection", collection_id],
        queryFn: async () => {
            const response = await axios.get(
                `${backendUrl}/collections/collectionItems/${collection_id}`,
            );
            return response.data;
        },
    });

    const [showAddPage, setShowAddPage] = useState(false);
    const options = ["Pages", "Components", "Fields"];
    const [selectedOption, setSelectedOption] = useState(options[0]);

    const deleteMutation = useMutation({
        mutationFn: async (page_id: string) => {
            await axios.delete(`${backendUrl}/page/${page_id}`);
            await axios.delete(`${backendUrl}/collection_items/${page_id}`);
            return page_id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["collection", collection_id],
            });
        },
        onError: (error) => {
            console.error("Error deleting page:", error);
        },
    });

    function handleDeletePage(page_id: string) {
        deleteMutation.mutate(page_id);
    }

    if (isLoading) {
        return <div>Collection Loading...</div>;
    }

    if (!collectionData) {
        return <div>Collection not found</div>;
    }

    console.log(collectionData, "collectionData");

    return (
        <div className="collection-pages-container">
            <div className="collection-pages-wrapper">
                <CollectionIntro
                    collection={collectionData}
                    collection_id={collectionData.collection_id}
                    showNavBtn={false}
                />
                <div className="view-options-container">
                    {options.map((item, ind) => (
                        <div
                            key={ind}
                            className={`options ${selectedOption == item ? "active" : ""}`}
                            onClick={() => setSelectedOption(item)}
                        >
                            {item}
                        </div>
                    ))}
                </div>
                {selectedOption == "Pages" && (
                    <div className="pages-list-container">
                        <div className="pages-list-wrapper">
                            {collectionData.pages?.map(
                                (item: pageType, ind: number) => (
                                    <PagePreview
                                        key={ind}
                                        page={item}
                                        deletePage={handleDeletePage}
                                        isDeleting={deleteMutation.isPending}
                                    />
                                ),
                            )}
                        </div>
                    </div>
                )}
                {selectedOption == "Fields" && (
                    <FieldsAndBlocksList
                        itemsList={collectionData.collection_items}
                        query_key_id={collection_id}
                        parentCollectionId={collection_id}
                        itemType="collection"
                        queryKey={["collection", collection_id]}
                        // joinTable="collection"
                    />
                )}
                {showAddPage && (
                    <PagePrompt
                        slug={collectionData?.slug}
                        collection_id={collectionData.collection_id}
                        setShowAddPage={setShowAddPage}
                        queryClient={queryClient}
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

export const PagePrompt = ({
    slug,
    collection_id,
    setShowAddPage,
    queryClient,
}: {
    slug: string;
    collection_id: string;
    setShowAddPage: React.Dispatch<React.SetStateAction<boolean>>;
    queryClient: any;
}) => {
    const [pageTitle, setPageTitle] = useState<string>("");

    const createPageMutation = useMutation({
        mutationFn: async () => {
            const page_id = uuidv4();
            const newPage = {
                title: pageTitle,
                slug: slug,
                page_id,
            };

            await axios.post(`${backendUrl}/page`, newPage);

            await axios.post(`${backendUrl}/collection-page`, {
                collection_id,
                page_id,
            });

            await axios.post(
                `${backendUrl}/collection/${collection_id}/collection_items`,
                {
                    reference_id: page_id,
                    type: "page",
                },
            );

            return newPage;
        },
        onSuccess: () => {
            // Invalidate and refetch the collection query
            queryClient.invalidateQueries({
                queryKey: ["collection", collection_id],
            });
            setShowAddPage(false);
        },
        onError: (error) => {
            console.error("Error creating page:", error);
        },
    });

    function handleSave() {
        if (pageTitle) {
            createPageMutation.mutate();
        }
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
                        <button
                            className="go-to-page-btn"
                            onClick={handleSave}
                            disabled={
                                createPageMutation.isPending || !pageTitle
                            }
                        >
                            {createPageMutation.isPending
                                ? "Saving..."
                                : "Save"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const PagePreview = ({
    page,
    deletePage,
    isDeleting,
}: {
    page: pageType;
    deletePage: (page_id: string) => void;
    isDeleting: boolean;
}) => {
    const navigate = useNavigate();

    function handleOpenPage(page_id: string) {
        navigate(`/pages/${page_id}`);
    }

    console.log(page, "pageItemsLis");

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
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
