import { NewCollectionModal } from "../Collections/components/NewCollectionModal";
import { NewElementModal } from "../Collections/components/NewElementModal";
import { NewPageItemsModals } from "../Pages/components/NewPageItemsModals";
import { NewPageModal } from "../Pages/components/NewPageModal";

export const RenderModal = ({ type }: { type: string | null }) => {
    function modelaRender(type: string | null) {
        switch (type) {
            case "collection":
                return <NewCollectionModal />;
            case "element":
                return <NewElementModal />;
            case "page":
                return <NewPageModal />;
            case "page-items":
                return <NewPageItemsModals />;
        }
    }

    return (
        <div>
            <div>{modelaRender(type)}</div>
        </div>
    );
};
