import React, { useState, useEffect } from "react";
import { ControlPanelSelect } from "@/components/canvas/ControlPanelSelect";
import { ToggleButton } from "@/components/canvas/ToggleButton";
import {
    ContentSourceType,
    updateContentSource,
    updateContentSourceId,
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
    const { contentSource, contentSourceId } = useSelector(
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
    const [selectedKey, setSelectedKey] = useState(""); // New state for selected key

    const dispatch = useDispatch();
    const { contentSourceId } = useSelector(
        (state: StoreState) => state.contentControl,
    );

    function handleContentSourceId(id) {
        dispatch(updateContentSourceId(id));
    }

    const handleFetchData = async () => {
        try {
            const response = await axios.get(
                `${backendUrl}/api-config/${contentSourceId}`,
            );
            setApiData(response.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleShowPreview = () => {
        setShowPreview(true);
    };

    const closePreview = () => {
        setShowPreview(false);
    };

    // Handler for when a key is selected from ApiDataPreview
    const handleKeySelection = (keyPath: string) => {
        setSelectedKey(keyPath);
    };

    // Handler for manual text field changes
    const handleSelectedKeyChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setSelectedKey(e.target.value);
    };

    return (
        <div>
            <div className="content-field-container">
                <label>API Endpoint</label>
            </div>
            <input
                type="text"
                className="content-input-field"
                value={
                    listOfApis?.data.filter((item) => {
                        return item.id == String(contentSourceId);
                    })[0]?.apiUrl || ""
                }
                readOnly
            />
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
            <button onClick={handleFetchData} disabled={!contentSourceId}>
                Fetch
            </button>

            <div className="content-field-container">
                <label>Selected Key Path</label>
            </div>
            <input
                type="text"
                className="content-input-field"
                value={selectedKey}
                onChange={handleSelectedKeyChange}
                placeholder="Select a key from preview or type manually"
            />

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
                                    selectedKey={selectedKey}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
