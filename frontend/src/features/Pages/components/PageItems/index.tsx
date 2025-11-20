import { AddBtn } from "@/components/ui/Buttons/AddBtn";
import "./index.scss";
import { useDispatch } from "react-redux";
import {
    clickFromSection,
    toggleModal,
    updateModalType,
    updateReferenceId,
} from "@/store/ModalSlice";
import { Plus } from "lucide-react";

export const PageItems = ({ items }) => {
    function renderPageItems(type: string, name: string, id) {
        switch (type) {
            case "section":
                const dispatch = useDispatch();

                function handleClick() {
                    dispatch(clickFromSection());
                    dispatch(toggleModal(true));
                    dispatch(updateModalType("page-items"));
                    dispatch(updateReferenceId(id));
                }

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
        }
    }

    console.log(items, "<- items");

    return (
        <div className="page-items-container">
            {items.map((item) =>
                renderPageItems(item.item_type, item.name, item.id),
            )}
        </div>
    );
};
