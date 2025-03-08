import { field } from "@/Types/fields";
import "./index.scss";
import { FieldWrapper } from "../FieldWrapper";
import { useState } from "react";
import * as React from "react";

export const Number = ({ data }: { data: field }) => {
    const [number, setNumber] = useState(data.value);

    function handleTextFieldChange(event: React.ChangeEvent<HTMLInputElement>) {
        setNumber(event.target.value);
    }

    return (
        <FieldWrapper data={data}>
            <div className="text-input-field-container">
                {/* <div>{data.name}</div> */}
                <input
                    className="text-input-field"
                    type="text"
                    value={number}
                    onChange={handleTextFieldChange}
                />
            </div>
        </FieldWrapper>
    );
};
