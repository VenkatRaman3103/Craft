import {
    clickFromSection,
    toggleModal,
    updateModalType,
    updateReferenceId,
} from "@/store/ModalSlice";
import { Ellipsis, Plus } from "lucide-react";
import { useDispatch } from "react-redux";
import "./index.scss";
import { useEffect, useState } from "react";

const dropDownMenuOptions: { label: string; name: string; func: any }[] = [
    { label: "copy fields", name: "copy", func: () => {} },
    { label: "paste fields", name: "copy", func: () => {} },
    { label: "edit", name: "copy", func: () => {} },
    { label: "delete", name: "delete", func: () => {} },
];

export const Section = ({ name, id }) => {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);

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
                <div className="action-btns">
                    <Plus
                        size={18}
                        className="plus-icon"
                        onClick={handleClick}
                    />
                    <div className="drop-down-menu-anchor">
                        <Ellipsis
                            size={18}
                            onClick={() => setShowMenu(!showMenu)}
                            className="horizontal-dots-icon"
                        />
                        {showMenu && (
                            <DropDownMenu options={dropDownMenuOptions} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const DropDownMenu = ({ options }) => {
    return (
        <div className="drop-down-menu-container">
            {options.map((opt) => (
                <div
                    className={`drop-down-menu-option ${opt.name}`}
                    onClick={opt.func}
                >
                    {opt.label}
                </div>
            ))}
        </div>
    );
};
