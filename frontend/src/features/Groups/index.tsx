import { NewCollection } from "@/components/ActionButtons/NewCollection";
import "./index.scss";
import { CollectionPreview } from "../Collections/components/CollectionPreview";

export const Group = ({ data }: any) => {
    return (
        <div className="group-container">
            <h1 className="heading">{data.title}</h1>
            <p className="description">{data.description}</p>
            <div className="collections">
                {data.collections.map((collection: any) => (
                    <CollectionPreview {...collection} />
                ))}
                <NewCollection referenceId={data.id} />
            </div>
        </div>
    );
};
