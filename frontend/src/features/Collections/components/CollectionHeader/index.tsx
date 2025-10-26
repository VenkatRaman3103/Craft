import { Slug } from "@/components/ui/common/Slug";
import "./index.scss";

export const CollectionHeader = ({ data }: any) => {
    console.log(data, "data CollectionContent");
    return (
        <div className="collection-container">
            <h1 className="heading">{data.name}</h1>
            <Slug slug={data.slug} />
            <p className="description">{data.description}</p>
        </div>
    );
};
