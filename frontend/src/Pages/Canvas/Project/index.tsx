import { StoreState } from "@/store/store";
import { getProjectById } from "@/api/canvas/getProjectById";
import { updatePages } from "@/store/canvas/projectSlice";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import "./index.scss";

type ItemType = "pages" | "layouts" | "variables";

export const Project = () => {
    const { project_id } = useParams();

    // store
    const { pages } = useSelector((state: StoreState) => state.canvasProject);
    const dispatch = useDispatch();

    // state
    const [activeItemType, setActiveItemType] = useState<ItemType>("pages");

    const { data, isLoading, isError } = useQuery({
        queryKey: ["project", project_id],
        queryFn: () => getProjectById(project_id!),
        onSuccess: (data) => {
            dispatch(updatePages(data.pages));
        },
    });

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

    function renderItems(itemType: ItemType): React.JSX {
        switch (itemType) {
            case "pages":
                return pages?.map((item) => (
                    <div key={item.page_id}>{item.name}</div>
                ));
            case "layouts":
                return <div>Layout</div>;
            case "variables":
                return <div>Variables</div>;
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
            <div>{renderItems(activeItemType)}</div>
        </div>
    );
};
