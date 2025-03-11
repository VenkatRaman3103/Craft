import { field } from "@/Types/fields";
import "./index.scss";
import { useEffect, useState } from "react";

export const MultiSelect = ({ data }: { data: field }) => {
    // Store the direct data since it already has the options
    const [fieldData, setFieldData] = useState<any>(data);

    useEffect(() => {
        console.log("Data received in MultiSelect:", data);
        setFieldData(data);
    }, [data]);

    console.log("fieldData in MultiSelect:", fieldData);

    return (
        <div className="multi-select-field-container">
            <div className="multi-select-field-wrapper">
                {fieldData &&
                fieldData.options &&
                fieldData.options.length > 0 ? (
                    fieldData.options.map((item, ind) => (
                        <div
                            key={item.option_id || ind}
                            className={`multi-select-field ${
                                fieldData.options.length - 1 === ind
                                    ? "last"
                                    : ""
                            }`}
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
                    ))
                ) : (
                    <div className="no-options-message">
                        No options available
                    </div>
                )}
            </div>
        </div>
    );
};
