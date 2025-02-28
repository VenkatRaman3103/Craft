import { field, multiSelect } from "@/Types/fields";
import { FieldWrapper } from "../FieldWrapper";
import "./index.scss";

export const MultiSelect = ({ data }: { data: field }) => {
    console.log(data.value, "dataMultiSelect");

    const multiSelectValues: multiSelect[] = Array.isArray(data.value)
        ? data.value
        : [];

    return (
        <FieldWrapper data={data}>
            <div className="multi-select-field-container">
                <div className="multi-select-field-wrapper">
                    {multiSelectValues.map((item, ind) => (
                        <div
                            key={ind}
                            className={`multi-select-field ${multiSelectValues.length - 1 === ind ? "last" : ""}`}
                        >
                            <label>
                                <input
                                    type="checkbox"
                                    value={item.value}
                                    readOnly
                                    checked={item.checked}
                                />
                                {item.value}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
        </FieldWrapper>
    );
};
