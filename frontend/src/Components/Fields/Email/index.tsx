import { field } from "@/Types/fields";
import "./index.scss";
import { FieldWrapper } from "../FieldWrapper";
import { useEffect, useState } from "react";

export const Email = ({ data }: { data: field }) => {
    const [email, setEmail] = useState(data.value);

    useEffect(() => {
        setEmail(data.value);
    }, [data.value]);

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
