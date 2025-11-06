import { CollectionHeader } from "@/features/Collections/components/CollectionHeader";
import { getCollection } from "@/features/Collections/services/api";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import "./index.scss";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { RenderModal } from "@/features/Modals/RenderModal";
import { Tabs } from "@/features/Collections/components/Tabs";
import { PagesList } from "@/features/Pages/components/PagesList";

export const CollectionPage = () => {
    const { collection_id } = useParams();

    const { data: collectionData } = useQuery({
        queryKey: ["collection", collection_id],
        queryFn: () => getCollection(collection_id),
    });

    const { active: isModalActive, type: modalType } = useSelector(
        (state: RootState) => state.modalSlice,
    );

    if (!collectionData) {
        return <div>collection data loading...</div>;
    }

    console.log(collection_id, collectionData, "collectionData");

    return (
        <>
            <div className="page">
                <CollectionHeader data={collectionData} />
            </div>
            <Tabs data={collectionData.elements} referenceId={collection_id} />

            {/* general container */}
            <div className="page-content">
                {/* specif */}
                <PagesList />
            </div>
            {isModalActive && <RenderModal type={modalType} />}
        </>
    );
};
