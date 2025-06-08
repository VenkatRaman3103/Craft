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
import { PagePrompt } from "@/components/PagePrompt";
import { PagePreview } from "@/components/PagePreview";

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

    const [pageTitle, setPageTitle] = useState<string>("");

    const createPageMutation = useMutation({
        mutationFn: async () => {
            const page_id = uuidv4();
            const newPage = {
                title: pageTitle,
                slug: collectionData.slug,
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

    function handleSave() {
        if (pageTitle) {
            createPageMutation.mutate();
        }
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
                                        deletePage={handleDeletePage}
                                        isDeleting={deleteMutation.isLoading}
                                        title={item.title}
                                        page_id={item.page_id}
                                        url={"/pages"}
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
                        title={pageTitle}
                        setTitle={setPageTitle}
                        isCreating={createPageMutation.isPending}
                        handleSave={handleSave}
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
