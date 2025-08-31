import { useQuery } from "@tanstack/react-query";
import { Layout } from "./layout";
import "./index.scss";
import { getCollections } from "@/api/collections/getCollections";
import { useParams } from "react-router";
import { SlugLabel } from "@/components/ui/SlugLabel";
import { Elements } from "@/components/Elements";

export const Collections = () => {
    const { collection_slug } = useParams();

    const { data: collectionData } = useQuery({
        queryFn: () => getCollections(collection_slug),
        queryKey: ["collection"],
    });

    if (!collectionData) {
        return <div></div>;
    }

    console.log(collectionData, "collectionData");

    return (
        <Layout>
            <div className="collection-page">
                <h1 className="collection-heading">{collectionData.name}</h1>

                <SlugLabel label={collectionData.slug} />

                <p className="collection-description">
                    {collectionData.description}
                </p>

                <Elements elements={collectionData.elements} />
            </div>
        </Layout>
    );
};
