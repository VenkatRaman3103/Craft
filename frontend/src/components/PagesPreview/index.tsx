import { SlugLabel } from "../ui/SlugLabel";
import "./index.scss";

export const PagesPreview = ({ page }: any) => {
    return (
        <div className="page-preview-container">
            <div className="page-preview-wrapper">
                <div className="page-preview-header">
                    <div className="page-heading">
                        <div className="page-icon"></div>
                        {page.name}
                    </div>
                    <SlugLabel label={page.slug} />
                </div>

                <div className="page-preview-description">
                    <p className="page-description">{page.description}</p>
                </div>
            </div>
        </div>
    );
};
