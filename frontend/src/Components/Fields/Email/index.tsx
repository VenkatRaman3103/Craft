import { field } from "@/Types/fields";
import "./index.scss";
import { FieldWrapper } from "../FieldWrapper";
import { useState } from "react";
import * as React from "react";

export const Email = ({ data }: { data: field }) => {
    const [email, setEmail] = useState(data.value);

    function handleTextFieldChange(event: React.ChangeEvent<HTMLInputElement>) {
        setEmail(event.target.value);
    }

    return (
        <div className="email-input-field-container">
            <input
                className="email-input-field"
                type="text"
                value={email}
                onChange={handleTextFieldChange}
            />
        </div>
    );
};
