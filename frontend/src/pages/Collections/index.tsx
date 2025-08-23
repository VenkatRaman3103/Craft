import { useQuery } from "@tanstack/react-query";
import { Layout } from "./layout";
import "./index.scss";
import { getCollections } from "@/api/collections/getCollections";
import { useParams } from "react-router";

export const Collections = () => {
    const { collection_slug } = useParams();

    const { data: collectionData } = useQuery({
        queryFn: () => getCollections(collection_slug),
        //
        queryKey: ["collection"],
    });

    console.log(collectionData, "collectionData");

    return (
        <Layout>
            <div className="root-collection-page">
                {/* <h1 className="collection-group-heading">Heading</h1> */}
                {/* <p className="collection-group-description"> */}
                {/*     Lorem ipsum dolor sit amet consectetur, adipisicing elit. */}
                {/*     Provident accusamus dolorem eligendi odio, pariatur, sed, */}
                {/*     beatae similique magni necessitatibus id saepe ullam eius */}
                {/*     porro autem amet perspiciatis sit repellat non? */}
                {/* </p> */}
                {/* <div className="collection-grid"> */}
                {/*     {rootCollections?.map((collection: any) => ( */}
                {/*         <CollectionPreview collection={collection} /> */}
                {/*     ))} */}
                {/* </div> */}
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
            <p className="collection-slug">
                slug: <span>{slug}</span>
            </p>
        </div>
    );
};
