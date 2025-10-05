import { NewCollectionModal } from "./NewCollection";

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
