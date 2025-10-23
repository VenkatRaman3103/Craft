import { useNavigate } from "react-router";
import "./index.scss";

export const CollectionPreview = ({ data }: any) => {
    const navigate = useNavigate();

    function handleNavigate() {
        navigate(`/collections/${data.slug}`);
    }

    return (
        <div className="collection-preview-container" onClick={handleNavigate}>
            <div className="collection-preview-wrapper">
                <div className="collection-name">{data.name}</div>
                <div className="collection-slug">
                    slug: <span>{data.slug}</span>
                </div>
                <div className="new-collection-button-wrapper">
                    <div>+</div>
                </div>
            </div>
        </div>
    );
};
