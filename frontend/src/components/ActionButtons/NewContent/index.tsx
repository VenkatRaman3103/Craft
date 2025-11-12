import { NewCollectionUnderElement } from "@/components/ActionButtons/NewCollection";
import { NewPage } from "@/components/ActionButtons/NewPage";
import { RootState } from "@/store";
import { useSelector } from "react-redux";

export const NewContent = () => {
    const { activeElementType } = useSelector(
        (state: RootState) => state.elementSlice,
    );

    function renderNewContentButton(type: any) {
        switch (type) {
            case "page":
                return <NewPage />;
            case "collection":
                return <NewCollectionUnderElement />;
        }
    }

    return <>{renderNewContentButton(activeElementType)}</>;
};
