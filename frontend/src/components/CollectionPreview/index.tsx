import "./index.scss";

type collectionType = {
    collection: {
        name: string;
        slug: string;
    };
};

export const CollectionPreview = ({ collection }: collectionType) => {
    const { name, slug } = collection;

    return (
        <div
            className="collection-preview"
            onClick={() => window.open(`/collections/${slug}`, "_blank")}
        >
            <h2 className="collection-preview-heading">{name}</h2>
            <p className="collection-preview-slug">
                slug: <span>{slug}</span>
            </p>
        </div>
    );
};
