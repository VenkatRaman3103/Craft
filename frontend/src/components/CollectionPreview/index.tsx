import { useNavigate } from "react-router";
import "./index.scss";

export const CollectionPreview = ({ name, slug }: any) => {
    const navigate = useNavigate();

    function handleNavigate() {
        navigate(`/collections/${slug}`);
    }

    return (
        <div className="collection-preview-container" onClick={handleNavigate}>
            <div className="collection-preview-wrapper">
                <div className="collection-name">{name}</div>
                <div className="collection-slug">
                    slug: <span>{slug}</span>
                </div>
                <div className="new-collection-button-wrapper">
                    <div>+</div>
                </div>
            </div>
        </div>
    );
};
