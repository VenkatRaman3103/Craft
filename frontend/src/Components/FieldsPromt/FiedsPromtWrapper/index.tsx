import { field } from "@/Types/fields";
import "./index.scss";
import { EllipsisVertical, PencilLine } from "lucide-react";
import { lightFont } from "@/Styles/base";
import { useEffect, useRef, useState } from "react";
import React from "react";

export const FieldPromtWrapper = ({
    children,
    data,
    fieldName,
    setFieldName,
}: {
    data: field;
    children: React.ReactNode;
    fieldName: string;
    setFieldName: React.Dispatch<React.SetStateAction<string>>;
}) => {
    const [inputWidth, setInputWidth] = useState("auto");
    const inputRef = useRef(null);

    useEffect(() => {
        if (inputRef.current) {
            const span = document.createElement("span");
            span.textContent = fieldName || "Field name"; // Ensure fallback
            span.style.visibility = "hidden";
            span.style.position = "absolute";
            span.style.fontSize = "14px";
            span.style.fontWeight = "500";
            span.style.whiteSpace = "nowrap";

            document.body.appendChild(span);
            const width = span.getBoundingClientRect().width;
            document.body.removeChild(span);

            setInputWidth(`${width + 10}px`);
        }
    }, [fieldName]);

    function handleFieldNameChange(event: React.ChangeEvent<HTMLInputElement>) {
        event.preventDefault();
        setFieldName(event.target.value);
    }

    console.log(data, "dataText");

    return (
        <div className="text-field-container prior-drop">
            <div className="text-field-header-contianer">
                <div className="text-field-header-wrapper">
                    <div className="text-field-heading-container">
                        <input
                            className="text-field-label"
                            style={{ width: inputWidth }}
                            ref={inputRef}
                            value={fieldName}
                            placeholder="Field name"
                            onChange={handleFieldNameChange}
                        />
                        <div className="text-field-type">/ {data.type}</div>
                    </div>
                    <div className="text-field-actions">
                        <div className="text-field-more">
                            <EllipsisVertical size={18} color={lightFont} />
                        </div>
                    </div>
                </div>
            </div>
            {children}
        </div>
    );
};
