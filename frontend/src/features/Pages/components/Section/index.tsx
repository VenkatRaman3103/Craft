import {
    clickFromSection,
    toggleModal,
    updateModalType,
    updateReferenceId,
} from "@/store/ModalSlice";
import { Plus } from "lucide-react";
import { useDispatch } from "react-redux";

export const Section = ({ name, id }) => {
    const dispatch = useDispatch();

    function handleClick() {
        dispatch(clickFromSection());
        dispatch(toggleModal(true));
        dispatch(updateModalType("page-items"));
        dispatch(updateReferenceId(id));
    }

    console.log(name, id, "section data");

    return (
        <div className="section-container">
            <div className="section-header">
                <div>{name}</div>
                <div onClick={handleClick} className="plus-icon">
                    <Plus size={18} />
                </div>
            </div>
        </div>
    );
};
