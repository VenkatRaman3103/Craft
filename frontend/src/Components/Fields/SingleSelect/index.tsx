// First, let's fix the SingleSelect component to handle the data structure correctly
import { field } from "@/Types/fields";
import { FieldWrapper } from "../FieldWrapper";
import "./index.scss";
import { useEffect, useState } from "react";

export const SingleSelect = ({ data }: { data: field }) => {
    const [fieldData, setFieldData] = useState<any>(data);

    useEffect(() => {
        if (data) {
            setFieldData(data);
        }
    }, [data]);

    return (
        <div className="single-select-field-container">
            <div className="single-select-field-wrapper">
                {fieldData &&
                    fieldData.options &&
                    fieldData.options.map((item, ind) => (
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
    );
};
