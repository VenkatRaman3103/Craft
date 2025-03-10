import "./index.scss";
import { EllipsisVertical } from "lucide-react";
import { lightFont } from "@/Styles/base";
import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { FieldMenuOptions } from "@/Components/FieldMenuOptions";
import { backendUrl } from "@/config";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";

export const FieldWrapper = ({
    children,
    data,
    queryClient,
    page_id,
}: {
    data: any;
    children: React.ReactNode;
    queryClient: any;
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
                    `${backendUrl}/fields/text_field/${updateData.field_id}`,
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
        const updateData = {
            field_id: data.field_id,
            label: label,
        };
        updateFieldMutation.mutate(updateData);
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
    }, [data]);

    function handleEdit() {
        setIsEditable(true);
        setShowOptions(false);
    }

    console.log(data, "dataField");

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
                    // isEditable={isEditable}
                    // setIsEditable={setIsEditable}
                    handleEdit={handleEdit}
                />
            )}

            {children}

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
                        onClick={handleUpdate}
                    >
                        Update Field
                    </button>
                </div>
            )}
        </div>
    );
};
