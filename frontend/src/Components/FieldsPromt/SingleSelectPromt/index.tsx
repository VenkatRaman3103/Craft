import { Trash2 } from "lucide-react";
import "./index.scss";

export const SingleSelectPromt = ({
    options,
    setOptions,
    checkedItems,
    setCheckedItems,
}: any) => {
    function addOptions() {
        const newId = `option-${Date.now()}`;
        setOptions([...options, { id: newId, value: "" }]);
        setCheckedItems({ ...checkedItems, [newId]: false });
    }

    function handleTextChange(id, newValue) {
        setOptions(
            options.map((opt) =>
                opt.id === id ? { ...opt, value: newValue } : opt,
            ),
        );
    }

    function handleCheckboxChange(id) {
        setCheckedItems({
            ...checkedItems,
            [id]: !checkedItems[id],
        });
    }

    function removeOption(id) {
        setOptions(options.filter((opt) => opt.id !== id));
        const updatedItems = { ...checkedItems };
        delete updatedItems[id];
        setCheckedItems(updatedItems);
    }

    return (
        <div className="single-select-field-container">
            {options.length > 0 && (
                <div className="single-select-field-wrapper">
                    {options.map((item, ind) => (
                        <div
                            key={item.id}
                            className={`single-select-field ${options.length - 1 === ind ? "last" : ""}`}
                        >
                            <label>
                                <input
                                    type="radio"
                                    checked={checkedItems[item.id] || false}
                                    onChange={() =>
                                        handleCheckboxChange(item.id)
                                    }
                                />
                                <input
                                    className="single-select-field-input"
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
