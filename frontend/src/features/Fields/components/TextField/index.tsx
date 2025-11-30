import "./index.scss";

type TextFieldType = {
    label: string;
    name: string;
    placeholder: string;
    updateFormData: any;
    description?: string;
};

export const TextField = ({
    name,
    updateFormData,
    // description,
}: TextFieldType) => {
    return (
        <div className="text-field-section">
            <label>{name}</label>
            <input
                type="text"
                placeholder="Enter the value"
                name={name}
                onChange={updateFormData}
            />
            {/* {description && <div className="description">{description}</div>} */}
        </div>
    );
};
