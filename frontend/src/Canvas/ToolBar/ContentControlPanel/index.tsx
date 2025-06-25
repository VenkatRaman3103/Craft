import React, { useState, useEffect } from "react";
import { ControlPanelSelect } from "@/components/canvas/ControlPanelSelect";
import { ToggleButton } from "@/components/canvas/ToggleButton";
import {
    ContentSourceType,
    updateContentSource,
    updateContentSourceId,
    updateKeyPath,
    updateTextWrap,
} from "@/store/toolbar/contentControl/contentControl";
import { Plus, Minus } from "lucide-react";
import "./index.scss";
import { elementsHash } from "@/Canvas/ElementPicker";
import { useSelector, useDispatch } from "react-redux";
import { StoreState } from "@/store/store";
import { getAllApiConfigurations } from "@/api/apiLayer/getAllApiConfigurations";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { backendUrl } from "@/config";
import DataPreview from "@/ApiLayer/DataPreview";
import ApiDataPreview from "./ApiDataPreview";

export const ContentControlPanel = ({
    elementContent,
    handleContentChange,
    textWrap,
    handleTextWrapChange,
    selectedElement,
}: {
    elementContent: string;
    handleContentChange: (value: string) => void;
    textWrap: string;
    handleTextWrapChange: (value: string) => void;
    selectedElement: any;
}) => {
    const dispatch = useDispatch();
    const { contentSource, contentSourceId, keyPath } = useSelector(
        (state: StoreState) => state.contentControl,
    );

    const isTextElement = elementsHash.text.includes(selectedElement?.type);
    const isListElement =
        selectedElement?.type === "ul" || selectedElement?.type === "ol";

    const [listItems, setListItems] = useState<string[]>([]);
    const [currentInput, setCurrentInput] = useState("");
    const [currentElementId, setCurrentElementId] = useState<
        string | number | null
    >(null);

    const contentSourceOptions = [
        { value: "raw" as ContentSourceType, label: "Raw" },
        { value: "api" as ContentSourceType, label: "API" },
        { value: "cms" as ContentSourceType, label: "CMS" },
    ];

    useEffect(() => {
        if (isListElement && selectedElement?.id) {
            if (currentElementId !== selectedElement.id) {
                setCurrentElementId(selectedElement.id);
                setCurrentInput("");
            }

            if (elementContent) {
                try {
                    const parsed = JSON.parse(elementContent);
                    if (Array.isArray(parsed)) {
                        setListItems(parsed);
                        return;
                    }
                } catch {
                    const items = elementContent
                        .split("<li>")
                        .slice(1)
                        .map((item) => item.replace("</li>", "").trim())
                        .filter((item) => item.length > 0);

                    if (items.length > 0) {
                        setListItems(items);
                        return;
                    }
                }
            }

            setListItems([]);
        } else if (!isListElement) {
            setListItems([]);
            setCurrentInput("");
            setCurrentElementId(null);
        }
    }, [selectedElement?.id, elementContent, isListElement, currentElementId]);

    useEffect(() => {
        if (isListElement && selectedElement?.id === currentElementId) {
            const newContent = JSON.stringify(listItems);
            if (newContent !== elementContent) {
                handleContentChange(newContent);
            }
        }
    }, [
        listItems,
        isListElement,
        handleContentChange,
        elementContent,
        selectedElement?.id,
        currentElementId,
    ]);

    const addListItem = () => {
        if (currentInput.trim()) {
            setListItems((prev) => [...prev, currentInput.trim()]);
            setCurrentInput("");
        }
    };

    const removeListItem = (index: number) => {
        setListItems((prev) => prev.filter((_, i) => i !== index));
    };

    const updateListItem = (index: number, value: string) => {
        setListItems((prev) =>
            prev.map((item, i) => (i === index ? value : item)),
        );
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addListItem();
        }
    };

    const handleContentSourceChange = (newSource: ContentSourceType) => {
        dispatch(updateContentSource(newSource));
    };

    const renderContentInput = () => {
        switch (contentSource) {
            case "api":
                return (
                    <ApiContentControl
                        elementContent={elementContent}
                        handleContentChange={handleContentChange}
                        contentSource={contentSource}
                        selectedElement={selectedElement}
                    />
                );
            case "cms":
                return (
                    <div className="content-field-container">
                        <label>CMS Content ID</label>
                        <input
                            type="text"
                            value={elementContent}
                            className="content-input"
                            onChange={(e) =>
                                handleContentChange(e.target.value)
                            }
                            placeholder="Enter CMS content identifier..."
                        />
                    </div>
                );
            default: // raw
                return isListElement ? (
                    <div className="list-content-container">
                        <div className="add-item-container">
                            <input
                                type="text"
                                value={currentInput}
                                onChange={(e) =>
                                    setCurrentInput(e.target.value)
                                }
                                onKeyPress={handleKeyPress}
                                placeholder="Enter list item..."
                                className="add-item-input list-field"
                            />
                            <button
                                onClick={addListItem}
                                disabled={!currentInput.trim()}
                                className={`add-item-button ${
                                    currentInput.trim() ? "enabled" : "disabled"
                                }`}
                            >
                                <Plus size={16} />
                            </button>
                        </div>

                        <div className="list-items-container">
                            {listItems.map((item, index) => (
                                <div
                                    key={`${selectedElement?.id}-${index}`}
                                    className="list-item-row"
                                >
                                    <span className="list-item-marker">
                                        {selectedElement?.type === "ol"
                                            ? `${index + 1}.`
                                            : "•"}
                                    </span>
                                    <input
                                        type="text"
                                        value={item}
                                        onChange={(e) =>
                                            updateListItem(
                                                index,
                                                e.target.value,
                                            )
                                        }
                                        className="list-item-input list-field"
                                    />
                                    <button
                                        onClick={() => removeListItem(index)}
                                        className="remove-item-button"
                                    >
                                        <Minus size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="content-field-container">
                        <label>Text</label>
                        <textarea
                            value={elementContent}
                            className="content-textarea"
                            onChange={(e) =>
                                handleContentChange(e.target.value)
                            }
                            placeholder="Enter text content..."
                            rows={3}
                        />
                    </div>
                );
        }
    };

    console.log(elementsHash.text, "elementsHash");
    console.log(contentSourceId, "constentSourseId");

    return (
        <div className="content-section-container toolbar-section">
            <div className="heading">Content</div>
            <div className="content-sub-section-container">
                {/* Content Source Toggle */}
                <div className="content-source-section">
                    <label className="content-source-label">
                        Content Source
                    </label>
                    <ToggleButton
                        options={contentSourceOptions}
                        value={contentSource}
                        onChange={handleContentSourceChange}
                        className="content-source-toggle"
                    />
                </div>

                {/* Content Input based on source */}
                {renderContentInput()}

                {isTextElement && (
                    <ControlPanelSelect
                        options={[
                            { value: "normal", label: "Wrap" },
                            { value: "nowrap", label: "No Wrap" },
                            { value: "pre", label: "Pre" },
                            { value: "pre-wrap", label: "Pre Wrap" },
                            { value: "pre-line", label: "Pre Line" },
                        ]}
                        sectionTitle="Text Wrap"
                        elementStyle={textWrap}
                        updateDispatch={updateTextWrap}
                    />
                )}
            </div>
        </div>
    );
};

export const ApiContentControl = ({
    elementContent,
    handleContentChange,
    contentSource,
    selectedElement,
}: any) => {
    const {
        data: listOfApis,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryFn: () => getAllApiConfigurations(),
        queryKey: ["api-configurations"],
    });

    const [apiData, setApiData] = useState();
    const [showPreview, setShowPreview] = useState(false);
    const [resolvedValue, setResolvedValue] = useState("");
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const dispatch = useDispatch();
    const { contentSourceId, keyPath } = useSelector(
        (state: StoreState) => state.contentControl,
    );

    function handleContentSourceId(id) {
        dispatch(updateContentSourceId(id));
    }

    const handleFetchData = async () => {
        if (!contentSourceId) return;

        try {
            const response = await axios.get(
                `${backendUrl}/api-config/${contentSourceId}`,
            );
            setApiData(response.data.data);
            setResolvedValue("");
            if (keyPath) {
                const value = resolveKeyPath(response.data.data, keyPath);
                const formattedValue = formatValueForDisplay(value);
                setResolvedValue(formattedValue);
                handleContentChange(formattedValue);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        if (contentSourceId && isInitialLoad) {
            handleFetchData();
            setIsInitialLoad(false);
        }
    }, [contentSourceId, isInitialLoad]);

    useEffect(() => {
        if (contentSourceId && !isInitialLoad) {
            handleFetchData();
        }
    }, [elementContent, contentSourceId]);

    useEffect(() => {
        if (contentSourceId) {
            handleFetchData();
        } else {
            setApiData(undefined);
            setResolvedValue("");
        }
    }, [contentSourceId]);

    const handleShowPreview = () => {
        setShowPreview(true);
    };

    const closePreview = () => {
        setShowPreview(false);
    };

    const handleKeySelection = (keyPath: string) => {
        dispatch(updateKeyPath(keyPath));
        if (apiData) {
            const value = resolveKeyPath(apiData, keyPath);
            const formattedValue = formatValueForDisplay(value);
            setResolvedValue(formattedValue);
            handleContentChange(formattedValue);
        }
    };

    const handleSelectedKeyChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const newKeyPath = e.target.value;
        dispatch(updateKeyPath(newKeyPath));
        if (apiData && newKeyPath.trim()) {
            const value = resolveKeyPath(apiData, newKeyPath);
            const formattedValue = formatValueForDisplay(value);
            setResolvedValue(formattedValue);
            handleContentChange(formattedValue);
        } else {
            setResolvedValue("");
            handleContentChange("");
        }
    };

    const handleUpdateKeyPath = () => {
        if (apiData && keyPath && keyPath.trim()) {
            const value = resolveKeyPath(apiData, keyPath);
            const formattedValue = formatValueForDisplay(value);
            handleContentChange(formattedValue);
        } else {
            handleContentChange("");
        }
    };

    const resolveKeyPath = (data: any, keyPath: string): any => {
        if (!keyPath || !data) return undefined;

        try {
            const keys = keyPath.split(/\.|\[|\]/).filter((key) => key !== "");
            let result = data;

            for (const key of keys) {
                if (result === null || result === undefined) return undefined;

                if (!isNaN(Number(key))) {
                    result = result[Number(key)];
                } else {
                    result = result[key];
                }
            }

            return result;
        } catch (error) {
            console.error("Error resolving key path:", error);
            return undefined;
        }
    };

    const formatValueForDisplay = (value: any): string => {
        if (value === null) return "null";
        if (value === undefined) return "undefined";
        if (typeof value === "string") return value;
        if (typeof value === "number" || typeof value === "boolean")
            return String(value);
        if (Array.isArray(value))
            return `Array(${value.length}): ${JSON.stringify(value)}`;
        if (typeof value === "object") return JSON.stringify(value, null, 2);
        return String(value);
    };

    React.useEffect(() => {
        if (apiData && keyPath) {
            const value = resolveKeyPath(apiData, keyPath);
            const formattedValue = formatValueForDisplay(value);
            setResolvedValue(formattedValue);
            handleContentChange(formattedValue);
        } else if (!keyPath) {
            setResolvedValue("");
        }
    }, [keyPath, apiData, handleContentChange]);

    return (
        <div>
            <div className="content-field-container">
                <label>API Configuration</label>
            </div>
            <select
                value={contentSourceId}
                onChange={(e) => handleContentSourceId(e.target.value)}
            >
                <option value="">Select an API configuration</option>
                {listOfApis?.data?.map((item) => (
                    <option key={item.id} value={item.id}>
                        {item.name}
                    </option>
                ))}
            </select>

            <button
                onClick={handleFetchData}
                disabled={!contentSourceId}
                style={{
                    marginLeft: "8px",
                    fontSize: "12px",
                    padding: "4px 8px",
                }}
            >
                Refresh
            </button>

            <div className="content-field-container">
                <label>Key Path</label>
            </div>
            <div className="key-path-input-container">
                <input
                    type="text"
                    className="content-input-field"
                    value={keyPath || ""}
                    onChange={handleSelectedKeyChange}
                    placeholder="Enter key path (e.g., data.items[0].name)"
                />
                <button
                    onClick={handleUpdateKeyPath}
                    disabled={!keyPath || !keyPath.trim()}
                    className={`update-button ${
                        keyPath && keyPath.trim() ? "enabled" : "disabled"
                    }`}
                >
                    Update
                </button>
            </div>

            <div className="content-field-container">
                <label>Value</label>
            </div>
            <div className="value-display-container">
                <textarea
                    value={resolvedValue}
                    className="value-display-field"
                    readOnly
                    placeholder="Value will appear here when key path is applied"
                    rows={3}
                />
            </div>

            {apiData && (
                <button
                    onClick={handleShowPreview}
                    className="show-preview-button"
                >
                    Show Preview
                </button>
            )}

            {showPreview && (
                <div className="modal-overlay" onClick={closePreview}>
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <h3>API Data Preview</h3>
                            <button
                                className="close-button"
                                onClick={closePreview}
                            >
                                ×
                            </button>
                        </div>
                        <div className="modal-body">
                            {apiData && (
                                <ApiDataPreview
                                    data={apiData}
                                    onKeySelect={handleKeySelection}
                                    selectedKey={keyPath || ""}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
