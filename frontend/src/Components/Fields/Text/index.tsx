import { field } from "@/Types/fields";
import "./index.scss";

export const Text = ({ data }: { data: field }) => {
    console.log(data, "dataText");
    return (
        <div className="text-field-container">
            <div className="text-field-header-contianer">
                <div className="text-field-header-wrapper">
                    <div className="text-field-heading-container">
                        <div className="text-field-label">{data.label}</div>
                        <div className="text-field-type">/ {data.type}</div>
                    </div>
                    <div className="text-field-actions">
                        <div className="text-field-edit">edit</div>
                        <div className="text-field-more">more</div>
                    </div>
                </div>
            </div>
            <div className="text-input-field-container">
                <input
                    className="text-input-field"
                    type="text"
                    value={data.value}
                    readOnly
                />
            </div>
        </div>
    );
};
