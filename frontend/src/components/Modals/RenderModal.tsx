import { NewCollectionModal } from "./NewCollectionModal";

export const RenderModal = ({ type }: { type: string | null }) => {
    function modelaRender(type: string | null) {
        switch (type) {
            case "collection":
                return <NewCollectionModal />;
        }
    }

    return (
        <div>
            <div>{modelaRender(type)}</div>
        </div>
    );
};
