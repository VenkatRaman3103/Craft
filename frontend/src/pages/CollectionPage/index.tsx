import { CollectionHeader } from "@/features/Collections/components/CollectionHeader";
import { getCollection } from "@/features/Collections/services/api";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import "./index.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { RenderModal } from "@/features/Modals/RenderModal";
import { PagesList } from "@/features/Pages/components/PagesList";
import { useEffect } from "react";
import { updateActiveCollectionId } from "@/store/CollectionSlice";
import { CollectionList } from "@/features/Collections/components/CollectionList";
import { Elements } from "@/features/Elements";

export const CollectionPage = () => {
    const { collection_id } = useParams();

    const dispatch = useDispatch();

    const { data: collectionData } = useQuery({
        queryKey: ["collection", collection_id],
        queryFn: () => getCollection(collection_id),
    });

    const { active: isModalActive, type: modalType } = useSelector(
        (state: RootState) => state.modalSlice,
    );

    const { activeElementType } = useSelector(
        (state: RootState) => state.elementSlice,
    );

    useEffect(() => {
        if (collection_id) {
            dispatch(updateActiveCollectionId(collection_id));
        }
    }, [collection_id]);

    function renderContent(type: string | null) {
        switch (type) {
            case "page":
                return <PagesList />;
            case "collection":
                return <CollectionList />;
        }
    }

    if (!collectionData) {
        return <div>collection data loading...</div>;
    }

    return (
        <>
            <div className="page">
                <CollectionHeader data={collectionData} />
            </div>
            <Elements />

            {/* general container */}
            <div className="page-content">
                {renderContent(activeElementType)}
            </div>
            {isModalActive && <RenderModal type={modalType} />}
        </>
    );
};
