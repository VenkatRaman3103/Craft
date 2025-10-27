import { NewCollectionModal } from "../Collections/components/NewCollectionModal";
import { NewElementModal } from "../Collections/components/NewElementModal";

export const RenderModal = ({ type }: { type: string | null }) => {
    function modelaRender(type: string | null) {
        switch (type) {
            case "collection":
                return <NewCollectionModal />;
            case "element":
                return <NewElementModal />;
        }
    }

    return (
        <div>
            <div>{modelaRender(type)}</div>
        </div>
    );
};
