import {
    clickFromSection,
    toggleModal,
    updateModalType,
    updateReferenceId,
} from "@/store/ModalSlice";
import { Ellipsis, Plus } from "lucide-react";
import { useDispatch } from "react-redux";
import "./index.scss";
import { useRef, useState } from "react";
import { useParams } from "react-router";
import { useHandleClickOutside } from "@/utils/useHandleClickOutside";
import { DropDownMenu } from "@/components/FloatingMenu/DropDownMenu";
import { useDropDownMenuOptions } from "../../hooks/useDropDownMenuOptions";
import { SimpleTabs } from "@/components/SimpleTabs";

type SectionType = {
    name: string;
    type: "normal" | "tab";
    id: string;
};

export const Section = ({ name, type, id }: SectionType) => {
    const { page_id } = useParams();

    const [isTabbedSection, setIsTabbedSection] = useState(type == "tab");

    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);

    function handleClick() {
        dispatch(clickFromSection());
        dispatch(toggleModal(true));
        dispatch(updateModalType("page-items"));
        dispatch(updateReferenceId(id));
    }

    const dropDownMenuOptions = useDropDownMenuOptions(id, page_id);
    const menuRef = useRef(null);

    useHandleClickOutside(menuRef, () => {
        setShowMenu(false);
    });

    const tabs = [
        {
            id: "123",
            name: "name",
            label: "label",
            component: <h1>Hello wolrd</h1>,
        },

        {
            id: "1234",
            name: "name 1",
            label: "label 1",
            component: <h1>Hello wolrd 1</h1>,
        },
    ];

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
            <div className="sections-content">
                <SimpleTabs tabs={tabs} />
            </div>
        </div>
    );
};
