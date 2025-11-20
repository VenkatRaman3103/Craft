import React, { useState } from "react";
import "./index.scss";

export const SelectField = ({
    label,
    name,
    options,
    updateFormData,
}: {
    label: string;
    name: string;
    options: any;
    updateFormData: any;
}) => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    function handleSelect(value: string) {
        setSelectedOption(value);
        updateFormData({ target: { name, value } });
    }

    return (
        <div className="field-section">
            <label>{label}</label>
            {options.map((option: any) => (
                <Option
                    key={option.value}
                    option={option}
                    isSelected={selectedOption === option.value}
                    onSelect={() => handleSelect(option.value)}
                />
            ))}
        </div>
    );
};

type OptionType = {
    option: { name: string; description: string; value: string };
    isSelected: boolean;
    onSelect: () => void;
};

const Option = ({ option, isSelected, onSelect }: OptionType) => {
    return (
        <div
            className={`option-wrapper ${isSelected ? "selected" : ""}`}
            onClick={onSelect}
        >
            <div className="option-icon" />
            <div className="option-content-section">
                <div className="option-name">{option.name}</div>
                <div className="option-description description">
                    {option.description}
                </div>
            </div>
        </div>
    );
};
