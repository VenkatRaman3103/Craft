import { CollectionPreview } from "../CollectionPreview";

export const Group = ({ data }: any) => {
    return (
        <div>
            <div className="content">
                <h1 className="heading">{data.title}</h1>
                <p className="description">{data.description}</p>
            </div>
            <div className="collections">
                {data.collections.map((collection: any) => (
                    <CollectionPreview data={collection} />
                ))}
            </div>
        </div>
    );
};
