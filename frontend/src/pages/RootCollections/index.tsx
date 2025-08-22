import { getRootCollections } from "@/api/collections/getRootCollections";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "./layout";
import "./index.scss";

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
                <h1>Heading</h1>
                <p>
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

type collectionType = {
    collection: {
        name: string;
        slug: string;
    };
};

export const CollectionPreview = ({ collection }: collectionType) => {
    const { name, slug } = collection;

    return (
        <div className="collection-preview">
            <h2 className="collection-heading">{name}</h2>
            <p>
                slug: <span className="collection-slug">{slug}</span>
            </p>
        </div>
    );
};
