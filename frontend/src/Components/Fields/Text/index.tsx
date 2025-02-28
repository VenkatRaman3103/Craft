import { field } from "@/Types/fields";
import "./index.scss";
import { FieldWrapper } from "../FilesWrapper";

export const Text = ({ data }: { data: field }) => {
    console.log(data, "dataText");
    return (
        <FieldWrapper data={data}>
            <div className="text-input-field-container">
                <input
                    className="text-input-field"
                    type="text"
                    value={data.value}
                    readOnly
                />
            </div>
        </FieldWrapper>
    );
};
