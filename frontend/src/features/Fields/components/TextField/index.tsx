import "./index.scss";

type TextFieldType = {
    label: string;
    name: string;
    placeholder: string;
    updateFormData: any;
    description?: string;
    value?: any;
};

export const TextField = ({ name, updateFormData, value }: TextFieldType) => {
    return (
        <div className="text-field-section">
            <label>{name}</label>
            <input
                type="text"
                placeholder="Enter the value"
                name={name}
                value={value && value}
                onChange={updateFormData}
            />
            {/* {description && <div className="description">{description}</div>} */}
        </div>
    );
};
