import {
    clickFromSection,
    toggleModal,
    updateModalType,
    updateReferenceId,
} from "@/store/ModalSlice";
import { Ellipsis, Plus } from "lucide-react";
import { useDispatch } from "react-redux";
import "./index.scss";

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
                <div className="action-btns">
                    <Plus
                        size={18}
                        className="plus-icon"
                        onClick={handleClick}
                    />
                    <Ellipsis size={18} className="horizontal-dots-icon" />
                </div>
            </div>
        </div>
    );
};
