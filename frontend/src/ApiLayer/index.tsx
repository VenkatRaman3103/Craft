import React, { useState, useMemo } from "react";
import {
    Plus,
    Trash2,
    Play,
    Upload,
    Eye,
    EyeOff,
    RefreshCw,
    Settings,
} from "lucide-react";
import "./index.scss";
import { ParamsPanel } from "./ParamsPanel";
import { OperationsPanel } from "./OperationPanel";

interface MapField {
    from: string;
    to: string;
    value: string;
    type: "copy" | "value" | "transform";
}

interface Operation {
    id: number;
    type: "filter" | "map";
    conditionType: "simple" | "custom";
    field: string;
    operator: string;
    value: string;
    customCode: string;
    mapFields: MapField[];
}

interface Field {
    value: string;
    label: string;
    type: string;
}

interface ApiParam {
    name: string;
    description: string;
    type: "string" | "number" | "boolean" | "date";
    defaultValue?: string;
    options?: string[];
}

interface ApiParamValue {
    [key: string]: string;
}

export const ApiEditor: React.FC = () => {
    const [jsonData, setJsonData] = useState<any[]>([]);
    const [operations, setOperations] = useState<Operation[]>([]);
    const [result, setResult] = useState<any[]>([]);
    const [showResults, setShowResults] = useState<boolean>(false);
    const [showPreview, setShowPreview] = useState<boolean>(false);
    const [showParams, setShowParams] = useState<boolean>(false);
    const [apiUrl, setApiUrl] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [paramValues, setParamValues] = useState<ApiParamValue>({});

    const availableFields: Field[] = useMemo(() => {
        if (jsonData.length === 0) return [];
        const firstItem = jsonData[0];
        const fields: Field[] = [];

        const extractFields = (obj: any, prefix = "") => {
            Object.keys(obj).forEach((key) => {
                const fullPath = prefix ? `${prefix}.${key}` : key;
                const value = obj[key];

                fields.push({
                    value: fullPath,
                    label: fullPath,
                    type: typeof value,
                });

                if (
                    typeof value === "object" &&
                    value !== null &&
                    !Array.isArray(value)
                ) {
                    extractFields(value, fullPath);
                }
            });
        };

        extractFields(firstItem);
        return fields;
    }, [jsonData]);

    const buildApiUrl = () => {
        if (!apiUrl.trim()) return "";

        const url = new URL(apiUrl);
        Object.entries(paramValues).forEach(([key, value]) => {
            if (value && value.trim()) {
                url.searchParams.set(key, value.trim());
            }
        });

        return url.toString();
    };

    const updateParamValue = (paramName: string, value: string) => {
        setParamValues((prev) => ({
            ...prev,
            [paramName]: value,
        }));
    };

    const clearParam = (paramName: string) => {
        setParamValues((prev) => {
            const updated = { ...prev };
            delete updated[paramName];
            return updated;
        });
    };

    const clearAllParams = () => {
        setParamValues({});
    };

    const fetchApiData = async () => {
        const finalUrl = buildApiUrl();
        if (!finalUrl) {
            setError("Please enter a valid API URL");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const response = await fetch(finalUrl);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            let processedData = data;

            if (!Array.isArray(data)) {
                if (data.data && Array.isArray(data.data)) {
                    processedData = data.data;
                } else if (data.results && Array.isArray(data.results)) {
                    processedData = data.results;
                } else if (data.items && Array.isArray(data.items)) {
                    processedData = data.items;
                } else {
                    processedData = [data];
                }
            }

            setJsonData(processedData);
            setShowPreview(true);
            setError("");
        } catch (err: any) {
            setError(`Failed to fetch data: ${err.message}`);
            setJsonData([]);
        } finally {
            setIsLoading(false);
        }
    };

    const addOperation = () => {
        const newOp: Operation = {
            id: Date.now(),
            type: "filter",
            conditionType: "simple",
            field: "",
            operator: "===",
            value: "",
            customCode: "",
            mapFields: [{ from: "", to: "", value: "", type: "copy" }],
        };
        setOperations([...operations, newOp]);
    };

    const updateOperation = (id: number, updates: Partial<Operation>) => {
        setOperations(
            operations.map((op) => (op.id === id ? { ...op, ...updates } : op)),
        );
    };

    const removeOperation = (id: number) => {
        setOperations(operations.filter((op) => op.id !== id));
    };

    const addMapField = (operationId: number) => {
        const operation = operations.find((op) => op.id === operationId);
        if (operation) {
            const newMapFields = [
                ...operation.mapFields,
                { from: "", to: "", value: "", type: "copy" as const },
            ];
            updateOperation(operationId, { mapFields: newMapFields });
        }
    };

    const updateMapField = (
        operationId: number,
        index: number,
        updates: Partial<MapField>,
    ) => {
        const operation = operations.find((op) => op.id === operationId);
        if (operation) {
            const newMapFields = operation.mapFields.map((field, i) =>
                i === index ? { ...field, ...updates } : field,
            );
            updateOperation(operationId, { mapFields: newMapFields });
        }
    };

    const removeMapField = (operationId: number, index: number) => {
        const operation = operations.find((op) => op.id === operationId);
        if (operation) {
            const newMapFields = operation.mapFields.filter(
                (_, i) => i !== index,
            );
            updateOperation(operationId, { mapFields: newMapFields });
        }
    };

    const executeOperations = () => {
        if (jsonData.length === 0) {
            alert("Please load data first");
            return;
        }

        try {
            let result = [...jsonData];

            operations.forEach((op) => {
                if (op.type === "filter") {
                    if (op.conditionType === "simple") {
                        result = result.filter((item) => {
                            const fieldValue = op.field
                                .split(".")
                                .reduce(
                                    (obj: any, key: string) => obj?.[key],
                                    item,
                                );
                            const compareValue = op.value;

                            switch (op.operator) {
                                case "===":
                                    return fieldValue === compareValue;
                                case "!==":
                                    return fieldValue !== compareValue;
                                case ">":
                                    return (
                                        Number(fieldValue) >
                                        Number(compareValue)
                                    );
                                case "<":
                                    return (
                                        Number(fieldValue) <
                                        Number(compareValue)
                                    );
                                case ">=":
                                    return (
                                        Number(fieldValue) >=
                                        Number(compareValue)
                                    );
                                case "<=":
                                    return (
                                        Number(fieldValue) <=
                                        Number(compareValue)
                                    );
                                case "includes":
                                    if (Array.isArray(fieldValue))
                                        return fieldValue.includes(
                                            compareValue,
                                        );
                                    return String(fieldValue).includes(
                                        String(compareValue),
                                    );
                                case "startsWith":
                                    return String(fieldValue).startsWith(
                                        String(compareValue),
                                    );
                                case "endsWith":
                                    return String(fieldValue).endsWith(
                                        String(compareValue),
                                    );
                                default:
                                    return false;
                            }
                        });
                    } else {
                        const filterFunction = new Function(
                            "item",
                            `return ${op.customCode || "true"}`,
                        );
                        result = result.filter(filterFunction);
                    }
                } else if (op.type === "map") {
                    if (op.conditionType === "simple") {
                        result = result.map((item) => {
                            const newItem: any = {};
                            op.mapFields.forEach((field) => {
                                if (field.type === "copy" && field.from) {
                                    const value = field.from
                                        .split(".")
                                        .reduce(
                                            (obj: any, key: string) =>
                                                obj?.[key],
                                            item,
                                        );
                                    newItem[field.to || field.from] = value;
                                } else if (field.type === "value" && field.to) {
                                    newItem[field.to] = field.value;
                                } else if (
                                    field.type === "transform" &&
                                    field.to
                                ) {
                                    const transformFunction = new Function(
                                        "item",
                                        `return ${field.value}`,
                                    );
                                    newItem[field.to] = transformFunction(item);
                                }
                            });
                            return Object.keys(newItem).length > 0
                                ? newItem
                                : item;
                        });
                    } else {
                        const mapFunction = new Function(
                            "item",
                            `return ${op.customCode || "item"}`,
                        );
                        result = result.map(mapFunction);
                    }
                }
            });

            setResult(result);
            setShowResults(true);
        } catch (error: any) {
            alert(`Error executing operations: ${error.message}`);
        }
    };

    const activeParamsCount = Object.keys(paramValues).filter(
        (key) => paramValues[key] && paramValues[key].trim(),
    ).length;

    return (
        <div className="api-editor">
            <div className="api-editor__left-panel">
                <div className="drop-section data-input-section">
                    <div className="section__controls">
                        <div className="api-input-group">
                            <input
                                type="text"
                                placeholder="Enter API URL (e.g., https://api.example.com/page/123)"
                                value={apiUrl}
                                onChange={(e) => setApiUrl(e.target.value)}
                                className="input api-url-input"
                                disabled={isLoading}
                            />
                        </div>

                        <div className="url-action-buttons-wrapper">
                            <span className="data-count">
                                {jsonData.length > 0
                                    ? `${jsonData.length} items loaded`
                                    : "No data loaded"}
                            </span>
                            <div className="url-action-buttons">
                                <button
                                    onClick={() => setShowParams(!showParams)}
                                    className={`btn btn--params ${showParams ? "btn--params--active" : ""}`}
                                >
                                    <Settings size={16} />
                                    Params{" "}
                                    {activeParamsCount > 0 &&
                                        `(${activeParamsCount})`}
                                </button>
                                <button
                                    onClick={fetchApiData}
                                    className="btn btn--primary"
                                    disabled={isLoading || !apiUrl.trim()}
                                >
                                    {isLoading ? (
                                        <RefreshCw
                                            size={16}
                                            className="spinning"
                                        />
                                    ) : (
                                        <Upload size={16} />
                                    )}
                                    Get
                                </button>
                            </div>
                        </div>

                        {showParams && (
                            <ParamsPanel
                                paramValues={paramValues}
                                updateParamValue={updateParamValue}
                                clearParam={clearParam}
                                clearAllParams={clearAllParams}
                                buildApiUrl={buildApiUrl}
                                apiUrl={apiUrl}
                            />
                        )}
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    {jsonData.length > 0 && (
                        <div className="preview-container">
                            <div className="preview-container__header">
                                <span className="preview-container__title">
                                    Data Preview
                                </span>
                                <button
                                    onClick={() => setShowPreview(!showPreview)}
                                    className="preview-container__toggle"
                                >
                                    {showPreview ? (
                                        <EyeOff size={14} />
                                    ) : (
                                        <Eye size={14} />
                                    )}
                                    {showPreview ? "Hide" : "Show"}
                                </button>
                            </div>
                            {showPreview && (
                                <div className="preview-container__content">
                                    <pre className="json-preview">
                                        {JSON.stringify(jsonData, null, 2)}
                                    </pre>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {jsonData.length > 0 && (
                    <OperationsPanel
                        operations={operations}
                        availableFields={availableFields}
                        addOperation={addOperation}
                        removeOperation={removeOperation}
                        updateOperation={updateOperation}
                        addMapField={addMapField}
                        updateMapField={updateMapField}
                        removeMapField={removeMapField}
                    />
                )}

                {jsonData.length > 0 && (
                    <button
                        onClick={executeOperations}
                        className="btn btn--success btn--execute"
                    >
                        <Play size={16} />
                        Execute Operations
                    </button>
                )}
            </div>

            <div className="api-editor__right-panel">
                {showResults ? (
                    <div className="drop-section results-section">
                        <div className="section__header">
                            <h2 className="section__title">Results</h2>
                            <div className="section__controls">
                                <span className="results-count">
                                    {result.length} items (from{" "}
                                    {jsonData.length} original)
                                </span>
                            </div>
                        </div>

                        <div className="results-display">
                            <pre className="results-display__content">
                                {JSON.stringify(result, null, 2)}
                            </pre>
                        </div>
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state__content">
                            <Play size={48} className="empty-state__icon" />
                            <p className="empty-state__title">
                                Execute operations to see results
                            </p>
                            <p className="empty-state__description">
                                Load data and configure operations on the left
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
