import React, { useState } from "react";
import "./index.scss";

export const NumberPrompt = ({
    number,
    setNumber,
}: {
    number: number;
    setNumber: React.Dispatch<React.SetStateAction<number>>;
}) => {
    function handleTextFieldChange(event: React.ChangeEvent<HTMLInputElement>) {
        event.preventDefault();
        setNumber(event.target.value);
    }

    return (
        <div className="number-input-field-container">
            <input
                className="number-input-field"
                type="number"
                value={number}
                onChange={handleTextFieldChange}
            />
        </div>
    );
};
