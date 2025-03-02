import { baseUrl } from "@/config";
import { StatusOption } from "../Status";
import "./index.scss";
import { formatDate } from "@/Utils/formateData";
import { useNavigate } from "react-router";

type collectionType =
    | "static-page"
    | "dynamic-page"
    | "content"
    | "media"
    | null;

type collectionIntroType = {
    collection: any;
    collection_id: string | null | undefined;
    showNavBtn: boolean;
};

export const CollectionIntro = ({
    collection,
    collection_id,
    showNavBtn,
}: collectionIntroType) => {
    const navigate = useNavigate();

    function goToCollectionPage() {
        navigate(`/collection/${collection_id}`);
    }

    function btnDescription(type: collectionType) {
        switch (type) {
            case "static-page":
                return "Go to Static Page";
            case "dynamic-page":
                return "Go to Dynamic Page";
            case "content":
                return "Go to Contents";
            case "media":
                return "Open Medias";
            default:
                return "Go to Collection";
        }
    }

    return (
        <div className="intro-wrapper">
            <div className="heading-wrapper">
                <div className="heading">
                    {collection?.name ? collection?.name : "Root Folder"}
                </div>

                <div className="info-wrapper">
                    {/*referenceId.collection_id*/}
                    {collection_id && (
                        <div className="collection-id">{collection_id}</div>
                    )}
                    <div className="edited-date">
                        <span className="label">Edited On:</span>
                        <span className="date">
                            {collection?.createdAt
                                ? formatDate(collection.createdAt)
                                : "Loading..."}
                        </span>
                    </div>
                </div>
            </div>
            <StatusOption status="publish" />
            <div className="description">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eum,
                nisi sit non beatae, voluptates quisquam ex ad repudiandae
                ducimus error in consequatur numquam dignissimos quidem! Harum
                soluta voluptatum molestias ipsa.
            </div>
            {showNavBtn && (
                <div className="action-buttons-wrapper">
                    <button className="go-to-btn" onClick={goToCollectionPage}>
                        {collection?.type
                            ? btnDescription(collection?.type)
                            : "Go to Collection"}
                    </button>
                </div>
            )}
        </div>
    );
};
