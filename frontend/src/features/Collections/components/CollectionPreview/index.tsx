import { useNavigate } from "react-router";
import "./index.scss";
import { Slug } from "@/components/ui/common/Slug";

export const CollectionPreview = ({ name, slug }: any) => {
    const navigate = useNavigate();

    function handleNavigate() {
        navigate(`/collections/${slug}`);
    }

    return (
        <div className="collection-preview-container" onClick={handleNavigate}>
            <div className="collection-preview-wrapper">
                <div className="collection-name">{name}</div>
                <Slug slug={slug} />
                <div className="new-collection-button-wrapper">
                    <div>+</div>
                </div>
            </div>
        </div>
    );
};
