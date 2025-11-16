import { Slug } from "@/components/ui/common/Slug";
import "./index.scss";

export const PageHeader = ({ data }: { data: any }) => {
    return (
        <div className="page-header-container">
            <h1 className="heading">{data.name}</h1>
            <Slug slug={data.slug} />
            <p className="description">{data.description}</p>
        </div>
    );
};
