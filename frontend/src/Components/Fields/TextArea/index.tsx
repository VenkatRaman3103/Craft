import { field } from "@/Types/fields";
import "./index.scss";
import { FieldWrapper } from "../FieldWrapper";

export const TextArean = ({ data }: { data: field }) => {
    console.log(data, "dataText");
    return (
        <FieldWrapper data={data}>
            <div className="text-input-field-container">
                <input
                    className="text-input-field"
                    type="textarea"
                    value={"hello world"}
                    readOnly
                />
            </div>
        </FieldWrapper>
    );
};
