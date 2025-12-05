import {
    clickFromSection,
    toggleModal,
    updateModalType,
    updateReferenceId,
} from "@/store/ModalSlice";
import { Ellipsis, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import "./index.scss";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { useHandleClickOutside } from "@/utils/useHandleClickOutside";
import { DropDownMenu } from "@/components/FloatingMenu/DropDownMenu";
import { useDropDownMenuOptions } from "../../hooks/useDropDownMenuOptions";
import { RootState } from "@/store";
import { renderItems } from "../../utils/renderItems";
import { updateDataBucket, setPromptBucket } from "@/store/ItemsBucketSlice";
import { useQuery } from "@tanstack/react-query";
import { getPageItemsBySectinId } from "../../service/api";

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

    const { data } = useQuery({
        queryFn: () => getPageItemsBySectinId(id),
        queryKey: [id, "sections"],
    });

    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        if (data?.length) {
            const newFormData: Record<
                string,
                { value: any; type: string; name: string; id?: string }
            > = {};
            const items: {
                value: any;
                type: string;
                name: string;
                id?: string;
            }[] = [];

            for (const d of data) {
                const obj = {
                    id: d.id,
                    value: d.value,
                    type: d.type,
                    name: d.name,
                };

                newFormData[d.name] = obj;
                items.push(obj);
            }

            dispatch(setPromptBucket({ key: id, items }));
            setFormData(newFormData);
        }
    }, [data, dispatch, id]);

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

    function handleFormDataChange(e) {
        const { value, type, name } = e.target;

        const existingField = formData[name];

        const obj = {
            id: existingField?.id,
            value,
            type,
            name,
        };

        const newFormData = {
            ...formData,
            [name]: obj,
        };

        setFormData(newFormData);
        dispatch(updateDataBucket({ key: id, obj: newFormData }));
    }

    const getDisplayValue = (item) => {
        if (formData[item.name]) {
            return formData[item.name].value;
        }
        return item.value;
    };

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
            {promptBucket[id]?.map((item, index) => (
                <>
                    {renderItems({
                        ...item,
                        value: getDisplayValue(item),
                        updateFormData: handleFormDataChange,
                    })}
                </>
            ))}
        </div>
    );
};
