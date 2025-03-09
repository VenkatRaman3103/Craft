import React, { useState } from "react";
import "./index.scss";
import { FieldWrapper } from "../FieldWrapper";

export const TextareaField = ({ data }) => {
    const [textarea, setTextarea] = useState(data.value);

    return (
        <FieldWrapper data={data}>
            <div className="textarea-input-field-container">
                <textarea
                    className="textarea-input-field"
                    value={textarea}
                    placeholder="Enter your text here..."
                />
            </div>
        </FieldWrapper>
    );
};
