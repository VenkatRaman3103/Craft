import "./index.scss";

type TextareaFieldType = {
    label: string;
    name: string;
    placeholder: string;
    updateFormData: any;
    description?: string;
};

export const TextareaField = ({
    label,
    name,
    placeholder,
    updateFormData, // bulk update the form data
    description,
}: TextareaFieldType) => {
    return (
        <div className="field-section">
            <label>{label}</label>
            <textarea
                placeholder={placeholder}
                className="description-textarea"
                name={name}
                onChange={updateFormData}
            />
            {description && <div className="description">{description}</div>}
        </div>
    );
};
