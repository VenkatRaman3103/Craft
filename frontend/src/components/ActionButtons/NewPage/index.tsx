import { AddBtn } from "@/components/ui/Buttons/AddBtn";
import { RootState } from "@/store";
import {
    toggleModal,
    updateModalType,
    updateReferenceId,
} from "@/store/ModalSlice";
import { useDispatch, useSelector } from "react-redux";

export const NewPage = ({ referenceId }: any) => {
    const dispatch = useDispatch();

    const { active: isModalActive } = useSelector(
        (state: RootState) => state.modalSlice,
    );

    function handleToggleModal() {
        dispatch(toggleModal(!isModalActive));
        dispatch(updateModalType("page"));
        dispatch(updateReferenceId(referenceId));
    }

    return <AddBtn onClickFn={handleToggleModal} />;
};
