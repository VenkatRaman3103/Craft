import "./index.scss";
import { CollectionPreview } from "../CollectionPreview";
import { NewCollection } from "../ActionButtons/NewCollection";

export const Group = ({ data }: any) => {
    return (
        <div className="group-container">
            <h1 className="heading">{data.title}</h1>
            <p className="description">{data.description}</p>
            <div className="collections">
                {data.collections.map((collection: any) => (
                    <CollectionPreview data={collection} />
                ))}
                <NewCollection referenceId={data.id} />
            </div>
        </div>
    );
};
