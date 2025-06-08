import { pageType } from "@/Types/blocks";
import { useNavigate } from "react-router";

export const PagePreview = ({
    deletePage,
    isDeleting,
    title,
    page_id,
    url,
}: {
    deletePage: (page_id: string) => void;
    isDeleting: boolean;
    title: string;
    page_id: string;
    url: string;
}) => {
    const navigate = useNavigate();

    function handleOpenPage(page_id: string) {
        navigate(`${url}/${page_id}`);
    }

    return (
        <div className="page-container">
            <div className="page-wrapper">
                <div className="page-image-wrapper">
                    <div className="page-image"></div>
                </div>
                <div className="collection-content-container">
                    <div className="collection-content-wrapper">
                        <div className="heading">{title}</div>
                        <button
                            className="go-to-page-btn"
                            onClick={() => handleOpenPage(page_id)}
                        >
                            Open Page
                        </button>
                        <button
                            className="go-to-page-btn"
                            onClick={() => deletePage(page_id)}
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
