import "./index.scss";

type collectionType = {
    name: string;
    slug: string;
};

export const CollectionPreview = ({ name, slug }: collectionType) => {
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
