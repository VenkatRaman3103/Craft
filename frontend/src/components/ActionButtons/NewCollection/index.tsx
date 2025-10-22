import { useDispatch, useSelector } from "react-redux";
import "./index.scss";
import { modalType, toggleModal, updateReferenceId } from "@/store/ModalSlice";
import { RootState } from "@/store";

export const NewCollection = ({
    referenceId,
}: {
    referenceId: string | null;
}) => {
    const dispatch = useDispatch();

    const { active: isModalActive } = useSelector(
        (state: RootState) => state.modalSlice,
    );

    function handleToggleModal() {
        dispatch(toggleModal(!isModalActive));
        dispatch(modalType("collection"));
        dispatch(updateReferenceId(referenceId));
    }

    return (
        <div className="new-collection-container" onClick={handleToggleModal}>
            <div className="new-collection-button-wrapper">
                <div>+</div>
            </div>
        </div>
    );
};
