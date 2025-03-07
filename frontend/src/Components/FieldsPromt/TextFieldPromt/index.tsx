import React, { useState } from "react";
import "./index.scss";

export const TextFieldPromt = ({ text, setText }) => {
    function handleTextFieldChange(event: React.ChangeEvent<HTMLInputElement>) {
        event.preventDefault();
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
