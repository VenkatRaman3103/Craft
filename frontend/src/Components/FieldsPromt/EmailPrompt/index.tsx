import React, { useState } from "react";
import "./index.scss";

export const EmailPrompt = ({ email, setEmail }) => {
    function handleTextFieldChange(event: React.ChangeEvent<HTMLInputElement>) {
        event.preventDefault();
        setEmail(event.target.value);
    }

    return (
        <div className="email-input-field-container">
            <input
                className="email-input-field"
                type="email"
                value={email}
                onChange={handleTextFieldChange}
            />
        </div>
    );
};
