import { Trash2 } from "lucide-react";
import "./index.scss";
import React from "react";

export const MultiSelectPrompt = ({
    options,
    setOptions,
    checkedItems,
    setCheckedItems,
}: {
    options: { value: string; id: string }[];
    setOptions: React.Dispatch<
        React.SetStateAction<{ value: string; id: string }[]>
    >;
    checkedItems: Record<string, boolean>;
    setCheckedItems: React.Dispatch<
        React.SetStateAction<Record<string, boolean>>
    >;
}) => {
    function addOptions() {
        const newId = `option-${Date.now()}`;
        setOptions([...options, { id: newId, value: "" }]);
        setCheckedItems({ ...checkedItems, [newId]: false });
    }

    function handleTextChange(id: string, newValue: string) {
        setOptions(
            options.map((opt: { value: string; id: string }) =>
                opt.id === id ? { ...opt, value: newValue } : opt,
            ),
        );
    }

    function handleCheckboxChange(id: string) {
        setCheckedItems({
            ...checkedItems,
            [id]: !checkedItems[id],
        });
    }

    function removeOption(id: string) {
        setOptions(
            options.filter(
                (opt: { value: string; id: string }) => opt.id !== id,
            ),
        );
        const updatedItems = {
            ...checkedItems,
        };
        delete updatedItems[id];
        setCheckedItems(updatedItems);
    }

    console.log(options, "optionsMulti");

    return (
        <div className="multi-select-field-container">
            {options.length > 0 && (
                <div className="multi-select-field-wrapper">
                    {options.map(
                        (item: { value: string; id: string }, ind: number) => (
                            <div
                                key={item.id}
                                className={`multi-select-field ${options.length - 1 === ind ? "last" : ""}`}
                            >
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={checkedItems[item.id] || false}
                                        onChange={() =>
                                            handleCheckboxChange(item.id)
                                        }
                                    />
                                    <input
                                        className="multi-select-field-input"
                                        type="text"
                                        value={item.value}
                                        onChange={(e) =>
                                            handleTextChange(
                                                item.id,
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Enter option value"
                                    />
                                </label>
                                <div
                                    className="remove-option-btn"
                                    onClick={() => removeOption(item.id)}
                                >
                                    <Trash2
                                        size={18}
                                        color="var(--light-font)"
                                    />
                                </div>
                            </div>
                        ),
                    )}
                </div>
            )}
            <div className="multi-select-field-btn" onClick={addOptions}>
                Add an Option
            </div>
        </div>
    );
};
