import "./index.scss";
import { EllipsisVertical } from "lucide-react";
import { lightFont } from "@/Styles/base";
import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { FieldMenuOptions } from "@/Components/FieldMenuOptions";
import { backendUrl } from "@/config";
import axios from "axios";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { TextFieldPromt } from "@/Components/FieldsPromt/TextFieldPromt";
import { MultiSelectPrompt } from "@/Components/FieldsPromt/MultiSelectPromt";
import { SingleSelectPromt } from "@/Components/FieldsPromt/SingleSelectPromt";
import { NumberPrompt } from "@/Components/FieldsPromt/NumberPrompt";
import { EmailPrompt } from "@/Components/FieldsPromt/EmailPrompt";
import { DatePrompt } from "@/Components/FieldsPromt/DatePrompt";
import { ColorPickerPrompt } from "@/Components/FieldsPromt/ColorPickerPrompt";
import { TextareaFieldPrompt } from "@/Components/FieldsPromt/TextareaPrompt";
import { JSONPromptField } from "@/Components/FieldsPromt/JsonPromptField";
import { UrlPromt } from "@/Components/FieldsPromt/UrlPromptField";

export const FieldWrapper = ({
    children,
    data,
    queryClient,
    page_id,
}: {
    data: any;
    children: React.ReactNode;
    queryClient: QueryClient;
    page_id: string;
}) => {
    const [showOptions, setShowOptions] = useState(false);
    const [activeOption, setActiveOption] = useState<string | null>(null);
    const [withContent, setWithContent] = useState(true);
    const [fieldName, setFieldName] = useState(data?.label || "");
    const [activeScopeOption, setActiveScopeOption] = useState<string | null>(
        null,
    );

    const [isEditable, setIsEditable] = useState(false);
    const [label, setLabel] = useState(data?.label || "");

    // State for different field types
    const [text, setText] = useState(data?.value || "");
    const [number, setNumber] = useState(data?.value || 0);
    const [email, setEmail] = useState(data?.value || "");
    const [date, setDate] = useState(data?.value ? new Date(data.value) : null);
    const [color, setColor] = useState(data?.value || "#3498db");
    const [textarea, setTextarea] = useState(data?.value || "");
    const [jsonData, setJsonData] = useState(
        data?.value || '{"example": "data"}',
    );
    const [url, setUrl] = useState({
        value: data.value || "",
        url_type: data.url_type,
    });

    // Multi-select fields
    const [multiSelectOptions, setMultiSelectOptions] = useState(
        data?.options || [],
    );
    const [checkedMultiSelectItems, setCheckedMultiSelectItems] = useState<{
        [key: string]: boolean;
    }>(() => {
        const initialState: { [key: string]: boolean } = {};
        if (data?.selectedOptions && data?.options) {
            data.options.forEach((option: string, index: number) => {
                initialState[index] = data.selectedOptions.includes(option);
            });
        }
        return initialState;
    });

    // Single-select fields
    const [singleSelectOptions, setSingleSelectOptions] = useState(
        data?.options || [],
    );
    const [checkedSingleSelectItems, setCheckedSingleSelectItems] = useState<{
        [key: string]: boolean;
    }>(() => {
        const initialState: { [key: string]: boolean } = {};
        if (data?.selectedOptions && data?.options) {
            data.options.forEach((option: string, index: number) => {
                initialState[index] = data.selectedOptions.includes(option);
            });
        }
        return initialState;
    });

    const optionsRef = useRef<HTMLDivElement>(null);
    const nameInputRef = useRef<HTMLDivElement>(null);
    const ellipsisRef = useRef<HTMLDivElement>(null);

    const toggleOptions = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowOptions(!showOptions);
        setActiveOption(null);
        setActiveScopeOption(null); // Reset scope option when toggling menu
    };

    const [inputWidth, setInputWidth] = useState("auto");
    const inputRef = useRef(null);

    useEffect(() => {
        if (inputRef.current) {
            const span = document.createElement("span");
            span.textContent = label;
            span.style.visibility = "hidden";
            span.style.position = "absolute";
            span.style.fontSize = "14px";
            span.style.fontWeight = "500";
            span.style.whiteSpace = "nowrap";

            document.body.appendChild(span);
            const width = span.getBoundingClientRect().width;
            document.body.removeChild(span);

            setInputWidth(`${width + 10}px`);
        }
    }, [label]);

    const handleClickOutside = (event: MouseEvent) => {
        if (
            optionsRef.current &&
            !optionsRef.current.contains(event.target as Node) &&
            nameInputRef.current &&
            !nameInputRef.current.contains(event.target as Node) &&
            ellipsisRef.current &&
            !ellipsisRef.current.contains(event.target as Node)
        ) {
            setShowOptions(false);
            setActiveOption(null);
            setActiveScopeOption(null);
        }
    };

    const fieldMutation = useMutation(
        async (data: any) => {
            try {
                // delete the field from page_items using  field_id
                const fieldResponse = await axios.delete(
                    `${backendUrl}/fields/${data.type}/${data.field_id}`,
                );

                // delete the field from its respective table using field_id and type
                const pageItemsResponse = await axios.delete(
                    `${backendUrl}/page_items/${data.field_id}`,
                );

                console.log(
                    fieldResponse.data,
                    pageItemsResponse.data,
                    "Deleted",
                );
            } catch (error) {
                const errorMessage = {
                    error,
                    message: `Failed to delete field: ${data.field_id}`,
                };
                console.log(errorMessage);
            }
        },
        {
            onSuccess: () => {
                // invalidate the "page_items"
                queryClient.invalidateQueries({
                    queryKey: ["pageData", page_id],
                });
            },
        },
    );

    async function onDelete(data: any) {
        console.log(data, "data to be deleted");
        fieldMutation.mutate(data);
    }

    const updateFieldMutation = useMutation(
        async (updateData: any) => {
            try {
                const response = await axios.patch(
                    `${backendUrl}/fields/${updateData.type}/${updateData.field_id}`,
                    updateData,
                );
                console.log(response.data, "Updated");
                return response.data;
            } catch (error) {
                const errorMessage = {
                    error,
                    message: `Failed to update field: ${updateData.field_id}`,
                };
                console.log(errorMessage);
                throw error;
            }
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ["pageData", page_id],
                });
                setIsEditable(false);
            },
        },
    );

    async function onUpdate(data: any) {
        let payload = {
            field_id: data.field_id,
            type: data.type,
            label: label,
        };

        console.log(data, "data to be updated");

        // Add value based on field type
        if (data.type === "text_field") {
            payload = {
                ...payload,
                value: text,
            };
        } else if (data.type === "multi_select") {
            const selectedOptions = multiSelectOptions
                .filter((opt, index) => checkedMultiSelectItems[index])
                .map((opt) => opt);

            payload = {
                ...payload,
                options: multiSelectOptions,
                selectedOptions,
            };
        } else if (data.type === "single_select") {
            const selectedOptions = singleSelectOptions
                .filter(
                    (opt: string, index: number) =>
                        checkedSingleSelectItems[index],
                )
                .map((opt: string) => opt);

            payload = {
                ...payload,
                options: singleSelectOptions,
                selectedOptions,
            };
        } else if (data.type === "number_field") {
            payload = {
                ...payload,
                value: number,
            };
        } else if (data.type === "email_field") {
            payload = {
                ...payload,
                value: email,
            };
        } else if (data.type === "date_field") {
            payload = {
                ...payload,
                value: date ? date.toISOString() : null,
            };
        } else if (data.type === "color_picker_field") {
            payload = {
                ...payload,
                value: color.value,
                hex: color.hex,
                rgb: color.rgb,
                rgba: color.rgba,
                hsl: color.hsl,
                hsla: color.hsla,
            };
        } else if (data.type === "textarea_field") {
            payload = {
                ...payload,
                value: textarea,
            };
        } else if (data.type === "json_field") {
            payload = {
                ...payload,
                value: jsonData,
            };
        } else if (data.type === "url_field") {
            payload = {
                ...payload,
                value: url.value,
                url_type: url.url_type,
            };
        }

        updateFieldMutation.mutate(payload);
    }

    function onEdit() {}
    function onRename() {}
    function onDuplicate() {}
    function onMove() {}
    function onRenameOption() {}
    function onMoveOption() {}

    const handleOptionClick = (e: React.MouseEvent, type: string) => {
        e.stopPropagation();
        setActiveOption(type);

        if (type === "edit" && onEdit) {
            onEdit(data.id);
            setShowOptions(false);
        } else if (type === "duplicate" && onDuplicate) {
            onDuplicate(data.id);
            setShowOptions(false);
        } else if (type === "move" && onMove) {
            onMove(data.id);
            setShowOptions(false);
        }
    };

    const handleScopeOptionClick = (e: React.MouseEvent, scope: string) => {
        e.stopPropagation();
        setActiveScopeOption((prev) => (prev === scope ? null : scope));
    };

    const handleDelete = () => {
        if (onDelete) {
            onDelete(data);
        }
        setShowOptions(false);
    };

    const handleUpdate = () => {
        if (onUpdate) {
            onUpdate(data);
        }
        setShowOptions(false);
    };

    const handleNameSubmit = () => {
        if (onRename && fieldName.trim() && activeScopeOption) {
            onRename(data.id, fieldName);
            setShowOptions(false);
            setActiveOption(null);
            setActiveScopeOption(null);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        setFieldName(data?.label || "");
        setLabel(data?.label || "");

        // Update all fields based on type
        if (data.type === "text_field") {
            setText(data.value || "");
        } else if (data.type === "multi_select") {
            setMultiSelectOptions(data.options || []);
            const initialState: { [key: string]: boolean } = {};
            if (data?.selectedOptions && data?.options) {
                data.options.forEach((option: string, index: number) => {
                    initialState[index] = data.selectedOptions.includes(option);
                });
            }
            setCheckedMultiSelectItems(initialState);
        } else if (data.type === "single_select") {
            setSingleSelectOptions(data.options || []);
            const initialState: { [key: string]: boolean } = {};
            if (data?.selectedOptions && data?.options) {
                data.options.forEach((option: string, index: number) => {
                    initialState[index] = data.selectedOptions.includes(option);
                });
            }
            setCheckedSingleSelectItems(initialState);
        } else if (data.type === "number_field") {
            setNumber(data.value || 0);
        } else if (data.type === "email_field") {
            setEmail(data.value || "");
        } else if (data.type === "date_field") {
            setDate(data.value ? new Date(data.value) : null);
        } else if (data.type === "color_picker_field") {
            setColor(data.value || "#3498db");
        } else if (data.type === "textarea_field") {
            setTextarea(data.value || "");
        } else if (data.type === "json_field") {
            setJsonData(data.value || '{"example": "data"}');
        } else if (data.type == "url_field") {
            setUrl({
                value: data.value,
                url_type: data.url_type,
            });
        }
    }, [data]);

    function handleEdit() {
        setIsEditable(true);
        setShowOptions(false);
    }

    function renderEditComponent() {
        console.log(data, "dataEdit");
        switch (data.type) {
            case "text_field":
                return <TextFieldPromt text={text} setText={setText} />;
            case "multi_select":
                return (
                    <MultiSelectPrompt
                        options={multiSelectOptions}
                        setOptions={setMultiSelectOptions}
                        checkedItems={checkedMultiSelectItems}
                        setCheckedItems={setCheckedMultiSelectItems}
                    />
                );
            case "single_select":
                return (
                    <SingleSelectPromt
                        options={singleSelectOptions}
                        setOptions={setSingleSelectOptions}
                        checkedItems={checkedSingleSelectItems}
                        setCheckedItems={setCheckedSingleSelectItems}
                    />
                );
            case "number_field":
                return <NumberPrompt number={number} setNumber={setNumber} />;
            case "email_field":
                return <EmailPrompt email={email} setEmail={setEmail} />;
            case "date_field":
                return <DatePrompt date={date} setDate={setDate} />;
            case "color_picker_field":
                return <ColorPickerPrompt color={color} setColor={setColor} />;
            case "textarea_field":
                return (
                    <TextareaFieldPrompt
                        textarea={textarea}
                        setTextarea={setTextarea}
                    />
                );
            case "json_field":
                return (
                    <JSONPromptField json={jsonData} setJSON={setJsonData} />
                );

            case "url_field":
                return <UrlPromt url={url} setUrl={setUrl} />;
            default:
                return <div>Unsupported field type</div>;
        }
    }

    console.log(data, "datalhlh");

    return (
        <div className="text-field-container">
            <div className="text-field-header-container">
                <div className="text-field-header-wrapper">
                    <div className="text-field-heading-container">
                        {isEditable ? (
                            <input
                                className="text-field-label"
                                value={label}
                                onChange={(e) => setLabel(e.target.value)}
                                ref={inputRef}
                                style={{ width: inputWidth }}
                            />
                        ) : (
                            <div className="text-field-label">
                                {data?.label}
                            </div>
                        )}
                        <div className="text-field-type">/ {data?.type}</div>
                    </div>
                    <div className="text-field-actions">
                        <div
                            className="text-field-more"
                            onClick={toggleOptions}
                            ref={ellipsisRef}
                        >
                            <EllipsisVertical size={18} color={lightFont} />
                        </div>
                    </div>
                </div>
            </div>

            {showOptions && (
                <FieldMenuOptions
                    nameInputRef={nameInputRef}
                    activeScopeOption={activeOption}
                    fieldName={fieldName}
                    handleNameSubmit={handleNameSubmit}
                    setActiveScopeOption={setActiveOption}
                    setFieldName={setFieldName}
                    optionsRef={optionsRef}
                    handleScopeOptionClick={handleOptionClick}
                    handleDelete={handleDelete}
                    withContent={withContent}
                    setWithContent={setWithContent}
                    handleEdit={handleEdit}
                />
            )}

            {isEditable ? renderEditComponent() : children}

            {isEditable && (
                <div className="action-btn-wrapper">
                    <button
                        className="create-block-button"
                        onClick={() => setIsEditable(false)}
                    >
                        Cancel
                    </button>
                    <button
                        className="create-block-button"
                        onClick={() => onUpdate(data)}
                    >
                        Update Field
                    </button>
                </div>
            )}
        </div>
    );
};
