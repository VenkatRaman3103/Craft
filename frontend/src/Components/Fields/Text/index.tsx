import { field } from "@/Types/fields";
import "./index.scss";
import { FieldWrapper } from "../FieldWrapper";
import { useEffect, useState } from "react";

export const Text = ({ data }: { data: field }) => {
    const [text, setText] = useState(data.value);

    // Update local state when props change
    useEffect(() => {
        setText(data.value);
    }, [data.value]);

    function handleTextFieldChange(event: React.ChangeEvent<HTMLInputElement>) {
        setText(event.target.value);
    }

    return (
        <div className="text-input-field-container prior-drop">
            <input
                className="text-input-field"
                type="text"
                value={text}
                onChange={handleTextFieldChange}
            />
        </div>
    );
};
