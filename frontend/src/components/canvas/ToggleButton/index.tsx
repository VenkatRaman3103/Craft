import React from "react";
import "./index.scss";

export type ToggleOption<T = string> = {
    value: T;
    label: string;
};

interface ToggleButtonProps<T = string> {
    options: ToggleOption<T>[];
    value: T;
    onChange: (value: T) => void;
    className?: string;
}

export const ToggleButton = <T extends string>({
    options,
    value,
    onChange,
    className = "",
}: ToggleButtonProps<T>) => {
    return (
        <div className={`toggle-button-container ${className}`}>
            {options.map((option) => (
                <button
                    key={option.value}
                    className={`toggle-button-option ${
                        value === option.value ? "active" : ""
                    }`}
                    onClick={() => onChange(option.value)}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
};
