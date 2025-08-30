import { useQuery } from "@tanstack/react-query";
import { Layout } from "./layout";
import "./index.scss";
import { getCollections } from "@/api/collections/getCollections";
import { useParams } from "react-router";
import { useState } from "react";
import { CollectionPreview } from "@/components/CollectionPreview";
import { PagesPreview } from "@/components/PagesPreview";
import { SlugLabel } from "@/components/ui/SlugLabel";

export const Collections = () => {
    // --- local state ---
    const [activeElement, setActiveElement] = useState(0);

    const { collection_slug } = useParams();

    // --- query ---
    const { data: collectionData } = useQuery({
        queryFn: () => getCollections(collection_slug),
        queryKey: ["collection"],
    });

    const renderElementContent = (kind: string) => {
        const tabContent = collectionData.elements[activeElement];

        console.log(tabContent, "tabContent");

        switch (kind) {
            case "collections":
                return (
                    <div className="collection-grid">
                        {tabContent.collections.map((collection: any) => (
                            <CollectionPreview {...collection} />
                        ))}
                    </div>
                );
            case "pages":
                return (
                    <div className="pages-list">
                        {tabContent.pages.map((page: any) => (
                            <PagesPreview page={page} />
                        ))}
                    </div>
                );
        }
    };

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

                <div className="elements-tabs">
                    {collectionData?.elements?.map(
                        (element: any, ind: number) => {
                            return (
                                <div
                                    className={`tab ${activeElement === ind ? "active" : ""}`}
                                    onClick={() => setActiveElement(ind)}
                                >
                                    {element.name}
                                </div>
                            );
                        },
                    )}
                </div>

                {/* TODO: add search bar, filters and columns*/}
                {/* <div></div> */}

                <div className="elements-contenr">
                    {renderElementContent(
                        collectionData?.elements[activeElement]?.kind,
                    )}
                </div>
            </div>
        </Layout>
    );
};
