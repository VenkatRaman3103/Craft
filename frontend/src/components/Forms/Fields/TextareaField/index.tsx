import "./index.scss";

export const TextareaField = ({
    label,
    name,
    placeholder,
    updateFormData, // bulk update the form data
    description,
}: any) => {
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
