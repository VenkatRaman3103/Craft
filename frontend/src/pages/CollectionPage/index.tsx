import { SideBar } from "@/components/SideBar";
import { TopBar } from "@/components/TopBar";
import { CollectionHeader } from "@/features/Collections/components/CollectionHeader";
import { getCollection } from "@/features/Collections/services/api";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import "./index.scss";

export const CollectionPage = () => {
    const { collection_id } = useParams();

    const { data: collectionData } = useQuery({
        queryKey: ["collection", collection_id],
        queryFn: () => getCollection(collection_id),
    });

    console.log(collectionData, "collectionData");

    return (
        <>
            <TopBar />
            <SideBar />
            <div className="page">
                <CollectionHeader data={collectionData} />
            </div>
            <div className="page-content"></div>
        </>
    );
};
