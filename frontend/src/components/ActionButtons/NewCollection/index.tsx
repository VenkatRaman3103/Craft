import { useDispatch, useSelector } from "react-redux";
import "./index.scss";
import {
    updateModalType,
    toggleModal,
    updateReferenceId,
    updateParentType,
} from "@/store/ModalSlice";
import { RootState } from "@/store";
import { AddBtn } from "@/components/ui/Buttons/AddBtn";

export const NewCollection = ({
    referenceId,
    parentType = "group",
}: {
    referenceId: string | null;
    parentType?: string;
}) => {
    const dispatch = useDispatch();

    const { active: isModalActive } = useSelector(
        (state: RootState) => state.modalSlice,
    );

    function handleToggleModal() {
        dispatch(toggleModal(!isModalActive));
        dispatch(updateModalType("collection"));
        dispatch(updateReferenceId(referenceId));
        dispatch(updateParentType(parentType));
    }

    return (
        <div className={`new-collection-container`} onClick={handleToggleModal}>
            <div className="new-collection-button-wrapper">
                <div>+</div>
            </div>
        </div>
    );
};

export const NewCollectionUnderElement = () => {
    const { activeElementId, activeElementType } = useSelector(
        (state: RootState) => state.elementSlice,
    );
    const dispatch = useDispatch();

    const { active: isModalActive } = useSelector(
        (state: RootState) => state.modalSlice,
    );

    function handleToggleModal() {
        dispatch(toggleModal(!isModalActive));
        dispatch(updateModalType("collection"));
        dispatch(updateReferenceId(activeElementId));
        dispatch(updateParentType(activeElementType));
    }

    return <AddBtn onClickFn={handleToggleModal} />;
};
