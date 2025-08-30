import { SlugLabel } from "../ui/SlugLabel";
import "./index.scss";

export const PagePreview = ({ name, description, slug }: any) => {
    return (
        <div className="page-preview-container">
            <div className="page-preview-wrapper">
                <div className="page-preview-header">
                    <div className="page-heading">
                        <div className="page-icon"></div>
                        {name}
                    </div>
                    <SlugLabel label={slug} />
                </div>

                <div className="page-preview-description">
                    <p className="page-description">{description}</p>
                </div>
            </div>
        </div>
    );
};
