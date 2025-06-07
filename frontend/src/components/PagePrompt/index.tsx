import { backendUrl } from "@/config";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

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
