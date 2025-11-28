import {
    clickFromSection,
    toggleModal,
    updateModalType,
    updateReferenceId,
} from "@/store/ModalSlice";
import { Ellipsis, Plus } from "lucide-react";
import { useDispatch } from "react-redux";
import "./index.scss";
import { useEffect, useRef, useState } from "react";
import { useDeleteSection } from "../../service/mutation";
import { useParams } from "react-router";
import { useHandleClickOutside } from "@/utils/useHandleClickOutside";

export const Section = ({ name, id }) => {
    const { page_id } = useParams();

    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);

    const deleteSection = useDeleteSection(id, page_id);

    const dropDownMenuOptions: { label: string; name: string; func: any }[] = [
        { label: "copy fields", name: "copy", func: () => {} },
        { label: "paste fields", name: "copy", func: () => {} },
        { label: "edit", name: "copy", func: () => {} },
        { label: "delete", name: "delete", func: () => deleteSection.mutate() },
    ];

    function handleClick() {
        dispatch(clickFromSection());
        dispatch(toggleModal(true));
        dispatch(updateModalType("page-items"));
        dispatch(updateReferenceId(id));
    }

    const menuRef = useRef(null);

    useHandleClickOutside(menuRef, () => {
        setShowMenu(false);
    });

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
                            className={`horizontal-dots-icon ${showMenu && "active"}`}
                        />
                        {showMenu && (
                            <DropDownMenu
                                options={dropDownMenuOptions}
                                menuRef={menuRef}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const DropDownMenu = ({ options, menuRef }) => {
    return (
        <div className="drop-down-menu-container" ref={menuRef}>
            {options.map((opt) => (
                <div
                    className={`drop-down-menu-option ${opt.name}`}
                    onClick={() => opt.func()}
                >
                    {opt.label}
                </div>
            ))}
        </div>
    );
};
