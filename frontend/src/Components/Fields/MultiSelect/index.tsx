import { field, multiSelect } from "@/Types/fields";
import { FieldWrapper } from "../FieldWrapper";
import "./index.scss";
import { useState } from "react";

export const MultiSelect = ({ data }: { data: field }) => {
    const [fieldData, setFieldData] = useState<any>(data);
    console.log(data, "dataMultiSelect");

    return (
        <FieldWrapper data={data}>
            <div className="multi-select-field-container">
                <div className="multi-select-field-wrapper">
                    {fieldData.options.map((item, ind) => (
                        <div
                            key={ind}
                            className={`multi-select-field ${fieldData.options.length - 1 === ind ? "last" : ""}`}
                        >
                            <label>
                                <input
                                    type="checkbox"
                                    value={item.value}
                                    readOnly
                                    checked={item.is_selected}
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
