import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { ContentHeader } from "@/components/ContentHeader";
import "./index.scss";
import { getCollectionByElementId } from "../../services/api";
import { CollectionPreview } from "../CollectionPreview";

export const CollectionList = () => {
    const { activeElementId } = useSelector(
        (state: RootState) => state.elementSlice,
    );

    const { data: collectionData } = useQuery({
        queryFn: () => getCollectionByElementId(activeElementId),
        queryKey: ["collections"],
    });

    console.log(
        collectionData,
        activeElementId,
        "collectionData CollectionList",
    );

    return (
        <div className="collections-list-container">
            <ContentHeader />
            <div className="collections collection-list">
                {collectionData?.map((collection: any) => (
                    <CollectionPreview {...collection} />
                ))}
            </div>
        </div>
    );
};
