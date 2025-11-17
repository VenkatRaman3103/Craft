import React, { useState } from "react";
import "./index.scss";

export const RadioFields = ({
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
    const [selectedOption, setSelectedOption] = useState<string>("");

    function handleSelect(value: string) {
        setSelectedOption(value);
        updateFormData({ target: { name, value } });
    }

    return (
        <div className="field-section">
            <label>{label}</label>

            {options.map((option: any) => (
                <RadioButtons
                    key={option.value}
                    option={option}
                    isSelected={selectedOption === option.value}
                    onSelect={() => handleSelect(option.value)}
                    name={name}
                />
            ))}
        </div>
    );
};

type OptionType = {
    option: { name: string; description: string; value: string };
    isSelected: boolean;
    onSelect: () => void;
    name: string;
};

const RadioButtons = ({ option, isSelected, onSelect, name }: OptionType) => {
    return (
        <label className="radio option-wrapper" onClick={onSelect}>
            <input
                type="radio"
                name={name}
                checked={isSelected}
                onChange={onSelect}
                className="radio-input"
            />

            <span className="custom-radio"></span>

            <div className="option-content-section">
                <div className="option-name">{option.name}</div>
                <div className="option-description description">
                    {option.description}
                </div>
            </div>
        </label>
    );
};
