import { getRootCollections } from "@/api/collections/getRootCollections";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "./layout";
import "./index.scss";
import { CollectionPreview } from "@/components/CollectionPreview";

export const RootCollections = () => {
    const { data: rootCollections } = useQuery({
        queryFn: () => getRootCollections(),
        //
        queryKey: ["rootCollections"],
    });

    console.log(rootCollections, "rootCollections");

    return (
        <Layout>
            <div className="root-collection-page">
                <h1 className="collection-group-heading">Heading</h1>
                <p className="collection-group-description">
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Provident accusamus dolorem eligendi odio, pariatur, sed,
                    beatae similique magni necessitatibus id saepe ullam eius
                    porro autem amet perspiciatis sit repellat non?
                </p>
                <div className="collection-grid">
                    {rootCollections?.map((collection: any) => (
                        <CollectionPreview collection={collection} />
                    ))}
                </div>
            </div>
        </Layout>
    );
};

/// components
