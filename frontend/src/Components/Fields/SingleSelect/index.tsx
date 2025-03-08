import { field } from "@/Types/fields";
import { FieldWrapper } from "../FieldWrapper";
import "./index.scss";
import { useState } from "react";

export const SingleSelect = ({ data }: { data: field }) => {
    const [fieldData, setFieldData] = useState<any>(data);

    return (
        <FieldWrapper data={data}>
            <div className="single-select-field-container">
                <div className="single-select-field-wrapper">
                    {fieldData.options.map((item, ind) => (
                        <div
                            key={ind}
                            className={`single-select-field ${fieldData.options.length - 1 === ind ? "last" : ""}`}
                        >
                            <label>
                                <input
                                    type="radio"
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
