import { Ellipsis } from "lucide-react";
import "./index.scss";
import { DropDownMenu } from "@/components/FloatingMenu/DropDownMenu";
import { useRef, useState } from "react";
import { useOverFlowMenu } from "@/features/Pages/hooks/useOverFlowMenu";
import { useHandleClickOutside } from "@/utils/useHandleClickOutside";

type TextFieldType = {
    label: string;
    name: string;
    placeholder: string;
    updateFormData: any;
    description?: string;
    value?: any;
    id: string;
    reference_id?: any;
};

export const TextField = ({
    name,
    id,
    updateFormData,
    value,
    reference_id,
}: TextFieldType) => {
    const [showMenu, setShowMenu] = useState(false);
    const overFlowMenu = useOverFlowMenu("text", id, reference_id);

    const menuRef = useRef(null);

    useHandleClickOutside(menuRef, () => {
        setShowMenu(false);
    });

    return (
        <div className="text-field-section">
            <div className="field-header">
                <label>{name}</label>

                <div className="drop-down-menu-anchor">
                    <Ellipsis
                        size={18}
                        onClick={() => setShowMenu(!showMenu)}
                        className={`horizontal-dots-icon ${showMenu && "active"}`}
                    />
                    {showMenu && (
                        <DropDownMenu
                            options={overFlowMenu}
                            menuRef={menuRef}
                        />
                    )}
                </div>
            </div>
            <input
                type="text"
                placeholder="Enter the value"
                name={name}
                value={value && value}
                onChange={updateFormData}
            />
            {/* {description && <div className="description">{description}</div>} */}
        </div>
    );
};
