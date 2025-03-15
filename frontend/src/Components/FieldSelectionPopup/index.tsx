import { useState, useRef, useEffect } from "react";
import { X, Plus, Check, FileText } from "lucide-react";
import { darkFont, lightFont } from "@/Styles/base";
import "./index.scss";
import * as React from "react";
import { FieldsIcons } from "@/Data/fieldsIcon";

type FieldOption = {
    id: string;
    name: string;
    type: string;
    description?: string;
};

interface FieldSelectionPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onAddFields: (selectedFields: string[]) => void;
    availableFields: FieldOption[];
}

export const FieldSelectionPopup: React.FC<FieldSelectionPopupProps> = ({
    isOpen,
    onClose,
    onAddFields,
    localFields,
    availableFields,
}) => {
    const [selectedFields, setSelectedFields] = useState<string[]>([]);
    const popupRef = useRef<HTMLDivElement>(null);
    const [selectedFieldsType, setSelectedFieldsType] = useState("all");

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                popupRef.current &&
                !popupRef.current.contains(event.target as Node)
            ) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    const toggleFieldSelection = (fieldId: string) => {
        setSelectedFields((prev) =>
            prev.includes(fieldId)
                ? prev.filter((id) => id !== fieldId)
                : [...prev, fieldId],
        );
    };

    const handleAddSelected = () => {
        onAddFields(selectedFields, selectedFieldsType);
        setSelectedFields([]);
        onClose();
    };

    function renderFieldsList(fieldsType: string): JSX.Element {
        switch (fieldsType) {
            case "all":
                return (
                    <>
                        {availableFields.map((field) => (
                            <div
                                key={field.id}
                                className={`field-option ${selectedFields.includes(field.id) ? "selected" : ""}`}
                                onClick={() => toggleFieldSelection(field.id)}
                            >
                                <div className="field-icon">
                                    {FieldsIcons[field.type]}
                                </div>

                                <div className="field-info">
                                    <div className="field-name">
                                        {field.name}
                                    </div>
                                    <div className="field-type">
                                        {field.type}
                                    </div>
                                    {field.description && (
                                        <div className="field-description">
                                            {field.description}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </>
                );
            case "local":
                return (
                    <>
                        {localFields.map((item) => {
                            const field = item[item.item_type];

                            return (
                                <div
                                    key={field.id}
                                    className={`field-option ${selectedFields.includes(field.field_id) ? "selected" : ""}`}
                                    onClick={() =>
                                        toggleFieldSelection(field.field_id)
                                    }
                                >
                                    <div className="field-icon">
                                        {FieldsIcons[field.type]}
                                    </div>

                                    <div className="field-info">
                                        <div className="field-name">
                                            {field.name}
                                        </div>
                                        <div className="field-type">
                                            {field.type}
                                        </div>
                                        {field.description && (
                                            <div className="field-description">
                                                {field.description}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </>
                );

            default:
                break;
        }
    }

    const typeOfFields = [
        { label: "All Fields", value: "all" },
        { label: "Local Fields", value: "local" },
        { label: "Global Fields", value: "global" },
    ];

    if (!isOpen) return null;

    return (
        <div className="field-selection-overlay">
            <div ref={popupRef} className="field-selection-popup">
                <div className="field-selection-content">
                    <div className="field-selection-header">
                        <div className="field-selection-heading-wrapper">
                            <div className="fields-icon">
                                <FileText size={22} color={darkFont} />
                            </div>
                            <h2>Add Fields</h2>
                        </div>
                        <button
                            className="close-button"
                            onClick={onClose}
                            aria-label="Close"
                        >
                            <X size={22} color={lightFont} />
                        </button>
                    </div>

                    <div className="field-types">
                        <div className="field-types-wrapper">
                            {typeOfFields.map((type, ind) => (
                                <div
                                    key={ind}
                                    className={`type-btn ${selectedFieldsType === type.value ? "selected" : ""}`}
                                    onClick={() =>
                                        setSelectedFieldsType(type.value)
                                    }
                                >
                                    {type.label}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search fields..."
                            className="search-input"
                        />
                    </div>
                </div>

                <div className="fields-list">
                    {renderFieldsList(selectedFieldsType)}
                </div>

                <div className="field-selection-footer">
                    <div className="selection-count">
                        {selectedFields.length} field
                        {selectedFields.length !== 1 ? "s" : ""} selected
                    </div>
                    <div className="action-buttons">
                        <button className="cancel-button" onClick={onClose}>
                            Cancel
                        </button>
                        <button
                            className="add-button"
                            onClick={handleAddSelected}
                            disabled={selectedFields.length === 0}
                        >
                            <Plus size={16} />
                            Add Fields
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
