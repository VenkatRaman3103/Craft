import {
    clickFromSection,
    toggleModal,
    updateModalType,
    updateReferenceId,
} from "@/store/ModalSlice";
import { Ellipsis, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import "./index.scss";
import { useRef, useState } from "react";
import { useParams } from "react-router";
import { useHandleClickOutside } from "@/utils/useHandleClickOutside";
import { DropDownMenu } from "@/components/FloatingMenu/DropDownMenu";
import { useDropDownMenuOptions } from "../../hooks/useDropDownMenuOptions";
import { RootState } from "@/store";
import { renderItems } from "../../utils/renderItems";
import { updateDataBucket } from "@/store/ItemsBucketSlice";

type SectionType = {
    name: string;
    type: "normal" | "tab";
    id: string;
};

export const Section = ({ name, type, id }: SectionType) => {
    const [formData, setFormData] = useState({});

    const { page_id } = useParams();

    const { promptBucket, dataBucket } = useSelector(
        (state: RootState) => state.itemsBucket,
    );

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

    console.log(promptBucket[id], "section items");

    function handleFormDataChange(e) {
        let obj = {
            value: e.target.value,
            type: e.target.type,
            name: e.target.name,
        };

        setFormData({
            ...formData,
            [e.target.name]: {
                ...obj,
            },
        });

        dispatch(updateDataBucket({ key: id, obj: formData }));
    }

    console.log(formData, dataBucket, "formData sender");

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
            {promptBucket[id]?.map((item) =>
                renderItems({ ...item, updateFormData: handleFormDataChange }),
            )}
        </div>
    );
};
