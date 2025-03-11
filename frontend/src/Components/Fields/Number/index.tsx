import { field } from "@/Types/fields";
import "./index.scss";
import { FieldWrapper } from "../FieldWrapper";
import { useEffect, useState } from "react";

export const Number = ({ data }: { data: field }) => {
    const [number, setNumber] = useState(data.value);

    function handleTextFieldChange(event: React.ChangeEvent<HTMLInputElement>) {
        setNumber(event.target.value);
    }

    useEffect(() => {
        setNumber(data.value);
    }, [data.value]);

    return (
        <div className="text-input-field-container">
            {/* <div>{data.name}</div> */}
            <input
                className="text-input-field"
                type="text"
                value={number}
                onChange={handleTextFieldChange}
            />
        </div>
    );
};
