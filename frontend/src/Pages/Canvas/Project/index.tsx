import "./index.scss";
import React, { useState } from "react";
import { CanvasPagePayload, createPage } from "@/api/canvas/pages/createPage";
import { PagePreview } from "@/components/PagePreview";
import { PagePrompt } from "@/components/PagePrompt";
import { StoreState } from "@/store/store";
import { deletePageById } from "@/api/canvas/pages/deletePageById";
import { getProjectById } from "@/api/canvas/getProjectById";
import { updatePages } from "@/store/canvas/projectSlice";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router";

type ItemType = "pages" | "layouts" | "variables";

export const Project = () => {
    const { project_id } = useParams();

    // global state (store)
    const { pages } = useSelector((state: StoreState) => state.canvasProject);
    const dispatch = useDispatch();

    // local state
    const [activeItemType, setActiveItemType] = useState<ItemType>("pages");
    const [showAddPage, setShowAddPage] = useState<boolean>(false);
    const [title, setTitle] = useState<string>("");

    // fetching project data
    const { data, isLoading, isError } = useQuery({
        queryKey: ["project", project_id],
        queryFn: () => getProjectById(project_id!),
        onSuccess: (data) => {
            dispatch(updatePages(data.pages));
        },
    });

    const queryClient = useQueryClient();

    // creation of new page
    const createMutation = useMutation({
        mutationFn: (payload: CanvasPagePayload) => createPage(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["project"],
            });
            setTitle("");
            setShowAddPage(false);
        },
    });

    // deletion of a page
    const deleteMutation = useMutation({
        mutationFn: (id: string) => deletePageById(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["project"],
            });
        },
    });

    // event handlers
    function handleCreatePage() {
        const payload: CanvasPagePayload = {
            name: title,
            status: "active",
            project_id: project_id,
        };
        createMutation.mutate(payload);
    }

    function handleDeltePage(id: string) {
        deleteMutation.mutate(id);
    }

    // loaders
    if (!project_id) {
        return <div>Project ID not found</div>;
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error loading project</div>;
    }

    console.log(pages, "pages: store");
    console.log(data, "pages: api");

    /**
     * @param: itemType (ItemType)
     * @returns: PagePreview | Layouts | Variables
     */
    function renderItems(itemType: ItemType): React.JSX {
        switch (itemType) {
            case "pages":
                return pages?.map((item) => (
                    <PagePreview
                        deletePage={handleDeltePage}
                        isDeleting={deleteMutation.isLoading}
                        title={item.name}
                        page_id={item.page_id}
                        url="/canvas/pages"
                        key={item.page_id}
                    />
                ));
            case "layouts":
                return <div>Layout</div>;
            case "variables":
                return <div>Variables</div>;
            default:
                return <div>Hello world</div>;
        }
    }

    return (
        <div className="canvas-project-container">
            <div className="canvas-project-intro-container">{project_id}</div>
            <div className="item-type-selector-container">
                <div
                    className={`item-type ${activeItemType == "pages" ? "active" : ""}`}
                    onClick={() => setActiveItemType("pages")}
                >
                    Pages
                </div>
                <div
                    className={`item-type ${activeItemType == "layouts" ? "active" : ""}`}
                    onClick={() => setActiveItemType("layouts")}
                >
                    Layouts
                </div>
                <div
                    className={`item-type ${activeItemType == "variables" ? "active" : ""}`}
                    onClick={() => setActiveItemType("variables")}
                >
                    Variables
                </div>
            </div>
            <div className="items-contianer">
                {renderItems(activeItemType)}
                {showAddPage && (
                    <PagePrompt
                        title={title}
                        setTitle={setTitle}
                        isCreating={createMutation.isLoading}
                        handleSave={handleCreatePage}
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
