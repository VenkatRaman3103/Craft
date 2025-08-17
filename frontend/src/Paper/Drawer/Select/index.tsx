import { useState } from "react";
import "./index.scss";
import { ArrowDown, ChevronDown } from "lucide-react";

export const Select = ({ options, defaultValue, update }) => {
    const [selectedOption, setSelectedOption] = useState(defaultValue);

    const [toggleOptions, setToggleOptions] = useState(false);

    console.log(options);

    return (
        <div>
            <div className="selected-value-container">
                <div className="selected-value-field">{selectedOption}</div>
                <div
                    className="selected-value-field-arrow"
                    onClick={() => setToggleOptions(!toggleOptions)}
                >
                    <ChevronDown size={16} />
                </div>
            </div>
            {toggleOptions && (
                <div className="options-lists-container">
                    {options.map((item, ind) => (
                        <div
                            className="option-item"
                            key={ind}
                            onClick={() => setSelectedOption(item)}
                        >
                            {item}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
