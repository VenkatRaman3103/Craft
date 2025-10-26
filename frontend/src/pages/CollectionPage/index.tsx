import { SideBar } from "@/components/SideBar";
import { TopBar } from "@/components/TopBar";
import { CollectionHeader } from "@/features/Collections/components/CollectionHeader";
import { getCollection } from "@/features/Collections/services/api";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import "./index.scss";
import { useState } from "react";
import { Plus } from "lucide-react";

export const CollectionPage = () => {
    const { collection_id } = useParams();

    const [activeTabId, setActiveTabId] = useState(1);

    const { data: collectionData } = useQuery({
        queryKey: ["collection", collection_id],
        queryFn: () => getCollection(collection_id),
    });

    if (!collectionData) {
        return <div>collection data loading...</div>;
    }

    console.log(collection_id, collectionData, "collectionData");

    return (
        <>
            <TopBar />
            <SideBar />
            <div className="page">
                <CollectionHeader data={collectionData} />
            </div>
            <div className="tabs-container">
                {Array(5)
                    .fill(0)
                    .map((_, index) => (
                        <div
                            className={`tab ${activeTabId === index ? "active" : ""}`}
                            onClick={() => setActiveTabId(index)}
                        >
                            item {index}
                        </div>
                    ))}

                <div className="tab add-new-tab">
                    <Plus />
                </div>
            </div>
            <div className="page-content">
                <div className="action-buttons">
                    <div className="search-bar">search bar</div>
                    <div className="filter-button">filter button</div>
                    <div className="columns-button">columns button</div>
                </div>
            </div>
        </>
    );
};
