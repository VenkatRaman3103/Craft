import "./index.scss";

type TextFieldType = {
    label: string;
    name: string;
    placeholder: string;
    updateFormData: any;
    description?: string;
};

export const TextField = ({
    label,
    name,
    placeholder,
    updateFormData,
    description,
}: TextFieldType) => {
    return (
        <div className="field-section">
            <label>{label}</label>
            <input
                type="text"
                placeholder={placeholder}
                name={name}
                onChange={updateFormData}
            />
            {description && <div className="description">{description}</div>}
        </div>
    );
};
