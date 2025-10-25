export const TextField = ({
    label,
    name,
    placeholder,
    updateFormData, // bulk update the form data
    description,
}: any) => {
    return (
        <div className="modal-section">
            <label>{label}</label>
            <input
                type="text"
                placeholder={placeholder}
                name={name}
                onChange={updateFormData}
            />
            {description && (
                <div className="description">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </div>
            )}
        </div>
    );
};
