import { field } from "@/Types/fields";
import "./index.scss";
import { FieldWrapper } from "../FieldWrapper";
import { useState } from "react";
import * as React from "react";

export const Text = ({ data }: { data: field }) => {
    const [text, setText] = useState(data.value);

    function handleTextFieldChange(event: React.ChangeEvent<HTMLInputElement>) {
        setText(event.target.value);
    }

    return (
        <div className="text-input-field-container">
            <input
                className="text-input-field"
                type="text"
                value={text}
                onChange={handleTextFieldChange}
            />
        </div>
    );
};
