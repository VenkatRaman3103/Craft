import { useDispatch } from "react-redux";

export type SelectOptionsType = { label: string; value: string }[];

export type ControlPanelSelectType = {
    options: SelectOptionsType;
    sectionTitle: string;
    elementStyle: any;
    updateDispatch: any;
};

export const ControlPanelSelect = ({
    options,
    sectionTitle,
    elementStyle,
    updateDispatch,
}: ControlPanelSelectType) => {
    const dispatch = useDispatch();
    return (
        <div className="border-width-sub-section">
            <div className="sub-heading">{sectionTitle}</div>
            <div className="border-width-tools-container">
                <select
                    className="select-drop-down"
                    value={elementStyle}
                    onChange={(e) => dispatch(updateDispatch(e.target.value))}
                >
                    {options.map(({ label, value }) => (
                        <option value={value} key={value}>
                            {label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};
