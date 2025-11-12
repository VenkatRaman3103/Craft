import { useNavigate } from "react-router";
import "./index.scss";
import { Slug } from "@/components/ui/common/Slug";
import { useQueryClient } from "@tanstack/react-query";

export const CollectionPreview = ({ name, slug, id }: any) => {
    const navigate = useNavigate();

    const queryClient = useQueryClient();

    function handleNavigate() {
        queryClient.removeQueries({ queryKey: ["collection"] });
        navigate(`/collections/${id}`);
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
