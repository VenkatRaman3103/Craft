import { field } from "@/Types/fields";
import "./index.scss";
import { FieldWrapper } from "../FieldWrapper";
import { useState } from "react";
import * as React from "react";

export const Text = ({
    data,
    onChange,
}: {
    data: field;
    onChange?: (value: string) => void;
}) => {
    function handleTextFieldChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (onChange) {
            onChange(event.target.value);
        }
    }

    return (
        <div className="text-input-field-container">
            <input
                className="text-input-field"
                type="text"
                value={data.value}
                onChange={handleTextFieldChange}
                readOnly={!onChange} // Make it read-only when no onChange handler is provided
            />
        </div>
    );
};
