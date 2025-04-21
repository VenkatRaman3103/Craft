import { Trash2 } from "lucide-react";
import "./index.scss";
import React, { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export const SingleSelectPromt = ({
    options,
    setOptions,
    checkedItems,
    setCheckedItems,
}: {
    options: { value: string; option_id: string; is_selected?: boolean }[];
    setOptions: React.Dispatch<
        React.SetStateAction<
            { value: string; option_id: string; is_selected?: boolean }[]
        >
    >;
    checkedItems: Record<string, boolean>;
    setCheckedItems: React.Dispatch<
        React.SetStateAction<Record<string, boolean>>
    >;
}) => {
    useEffect(() => {
        const updatedCheckedItems = { ...checkedItems };
        let needsUpdate = false;

        options.forEach((option) => {
            if (option.is_selected && !checkedItems[option.option_id]) {
                updatedCheckedItems[option.option_id] = true;
                needsUpdate = true;
            }
        });

        if (needsUpdate) {
            setCheckedItems(updatedCheckedItems);
        }
    }, [options]);

    function addOptions() {
        const newId = uuidv4();
        setOptions([
            ...options,
            { option_id: newId, value: "", is_selected: false },
        ]);
        setCheckedItems({ ...checkedItems, [newId]: false });
    }

    function handleTextChange(id: string, newValue: string) {
        setOptions(
            options.map((opt) =>
                opt.option_id === id ? { ...opt, value: newValue } : opt,
            ),
        );
    }

    function handleCheckboxChange(option_id: string) {
        setCheckedItems({
            ...checkedItems,
            [option_id]: !checkedItems[option_id],
        });
        setOptions(
            options.map((opt) =>
                opt.option_id === option_id
                    ? { ...opt, is_selected: !checkedItems[option_id] }
                    : opt,
            ),
        );
    }

    function removeOption(id: string) {
        setOptions(options.filter((opt) => opt.option_id !== id));
        const updatedItems = {
            ...checkedItems,
        };
        delete updatedItems[id];
        setCheckedItems(updatedItems);
    }

    return (
        <div className="single-select-field-container">
            {options.length > 0 && (
                <div className="single-select-field-wrapper">
                    {options.map((item, ind) => (
                        <div
                            key={item.option_id}
                            className={`single-select-field ${options.length - 1 === ind ? "last" : ""}`}
                        >
                            <label>
                                <input
                                    type="radio"
                                    checked={
                                        checkedItems[item.option_id] ||
                                        item.is_selected
                                    }
                                    onChange={() =>
                                        handleCheckboxChange(item.option_id)
                                    }
                                />
                                <input
                                    className="single-select-field-input"
                                    type="text"
                                    value={item.value}
                                    onChange={(e) =>
                                        handleTextChange(
                                            item.option_id,
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Enter option value"
                                />
                            </label>
                            <div
                                className="remove-option-btn"
                                onClick={() => removeOption(item.option_id)}
                            >
                                <Trash2 size={18} color="var(--light-font)" />
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <div className="single-select-field-btn" onClick={addOptions}>
                Add an Option
            </div>
        </div>
    );
};
