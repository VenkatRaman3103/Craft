import React, { useState, useMemo } from "react";
import {
    Plus,
    Trash2,
    Play,
    Download,
    Upload,
    Eye,
    EyeOff,
    RefreshCw,
    Settings,
} from "lucide-react";
import "./index.scss";

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

    const availableParams: ApiParam[] = [
        {
            name: "type",
            description: "Filter by item type (comma-separated)",
            type: "string",
            defaultValue: "",
        },
        {
            name: "scope",
            description: "Filter by scope",
            type: "string",
            defaultValue: "",
        },
        {
            name: "limit",
            description: "Maximum number of items to return",
            type: "number",
            defaultValue: "",
        },
        {
            name: "offset",
            description: "Number of items to skip",
            type: "number",
            defaultValue: "",
        },
        {
            name: "sort",
            description: "Field to sort by",
            type: "string",
            defaultValue: "",
        },
        {
            name: "order",
            description: "Sort order",
            type: "string",
            options: ["asc", "desc"],
            defaultValue: "asc",
        },
        {
            name: "search",
            description: "Search in name, label, or description",
            type: "string",
            defaultValue: "",
        },
        {
            name: "required",
            description: "Filter by required status",
            type: "boolean",
            options: ["true", "false"],
            defaultValue: "",
        },
        {
            name: "fields",
            description: "Select specific fields (comma-separated)",
            type: "string",
            defaultValue: "",
        },
        {
            name: "exclude_empty",
            description: "Exclude items with empty values",
            type: "boolean",
            options: ["true", "false"],
            defaultValue: "",
        },
        {
            name: "date_from",
            description: "Filter items created after this date",
            type: "date",
            defaultValue: "",
        },
        {
            name: "date_to",
            description: "Filter items created before this date",
            type: "date",
            defaultValue: "",
        },
        {
            name: "include_nested",
            description: "Include nested data structures",
            type: "boolean",
            options: ["true", "false"],
            defaultValue: "",
        },
        {
            name: "format",
            description: "Response format",
            type: "string",
            options: ["grouped", "flat"],
            defaultValue: "",
        },
    ];

    const operationTypes = [
        { value: "filter", label: "Filter (item => boolean)" },
        { value: "map", label: "Map (item => newItem)" },
    ];

    const conditionTypes = [
        { value: "simple", label: "Simple Condition" },
        { value: "custom", label: "Custom JavaScript" },
    ];

    const operators = [
        { value: "===", label: "Equals (===)" },
        { value: "!==", label: "Not Equals (!==)" },
        { value: ">", label: "Greater Than (>)" },
        { value: "<", label: "Less Than (<)" },
        { value: ">=", label: "Greater Than or Equal (>=)" },
        { value: "<=", label: "Less Than or Equal (<=)" },
        { value: "includes", label: "Includes (string/array)" },
        { value: "startsWith", label: "Starts With" },
        { value: "endsWith", label: "Ends With" },
        { value: "&&", label: "AND (&&)" },
        { value: "||", label: "OR (||)" },
    ];

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
                            <div className="params-panel">
                                <div className="params-panel__header">
                                    <h3 className="params-panel__title">
                                        URL Parameters
                                    </h3>
                                    <button
                                        onClick={clearAllParams}
                                        className="btn btn--danger btn--sm"
                                        disabled={activeParamsCount === 0}
                                    >
                                        Clear All
                                    </button>
                                </div>

                                <div className="params-table">
                                    {availableParams.map((param) => (
                                        <div
                                            key={param.name}
                                            className="param-row"
                                        >
                                            <div className="param-info">
                                                <div className="param-name">
                                                    {param.name}
                                                </div>
                                                <div className="param-description">
                                                    {param.description}
                                                </div>
                                            </div>

                                            <div className="param-input">
                                                {param.options ? (
                                                    <select
                                                        value={
                                                            paramValues[
                                                                param.name
                                                            ] || ""
                                                        }
                                                        onChange={(e) =>
                                                            updateParamValue(
                                                                param.name,
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="select"
                                                    >
                                                        <option value="">
                                                            Select {param.name}
                                                        </option>
                                                        {param.options.map(
                                                            (option) => (
                                                                <option
                                                                    key={option}
                                                                    value={
                                                                        option
                                                                    }
                                                                >
                                                                    {option}
                                                                </option>
                                                            ),
                                                        )}
                                                    </select>
                                                ) : (
                                                    <input
                                                        type={
                                                            param.type ===
                                                            "date"
                                                                ? "date"
                                                                : param.type ===
                                                                    "number"
                                                                  ? "number"
                                                                  : "text"
                                                        }
                                                        placeholder={
                                                            param.defaultValue ||
                                                            `Enter ${param.name}`
                                                        }
                                                        value={
                                                            paramValues[
                                                                param.name
                                                            ] || ""
                                                        }
                                                        onChange={(e) =>
                                                            updateParamValue(
                                                                param.name,
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="input"
                                                    />
                                                )}

                                                {paramValues[param.name] && (
                                                    <button
                                                        onClick={() =>
                                                            clearParam(
                                                                param.name,
                                                            )
                                                        }
                                                        className="btn btn--danger btn--sm param-clear"
                                                        title="Clear parameter"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {(apiUrl || activeParamsCount > 0) && (
                                    <div className="url-preview">
                                        <div className="url-preview__label">
                                            Final URL:
                                        </div>
                                        <code className="url-preview__url">
                                            {buildApiUrl() || apiUrl}
                                        </code>
                                    </div>
                                )}
                            </div>
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
                    <div className="drop-section operations-section">
                        {operations.map((op, index) => (
                            <div key={op.id} className="operation-card">
                                <div className="operation-card__header">
                                    <div className="operation-card__header-wrapper">
                                        <span className="operation-badge">
                                            Operation {index + 1}
                                        </span>
                                        <button
                                            onClick={() =>
                                                removeOperation(op.id)
                                            }
                                            className="btn btn--danger btn--sm"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <div className="filter-wrapper">
                                        <select
                                            value={op.type}
                                            onChange={(e) =>
                                                updateOperation(op.id, {
                                                    type: e.target.value as
                                                        | "filter"
                                                        | "map",
                                                })
                                            }
                                            className="select select--operation-type"
                                        >
                                            {operationTypes.map((type) => (
                                                <option
                                                    key={type.value}
                                                    value={type.value}
                                                >
                                                    {type.label}
                                                </option>
                                            ))}
                                        </select>
                                        <select
                                            value={op.conditionType}
                                            onChange={(e) =>
                                                updateOperation(op.id, {
                                                    conditionType: e.target
                                                        .value as
                                                        | "simple"
                                                        | "custom",
                                                })
                                            }
                                            className="select select--condition-type"
                                        >
                                            {conditionTypes.map((type) => (
                                                <option
                                                    key={type.value}
                                                    value={type.value}
                                                >
                                                    {type.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {op.conditionType === "simple" ? (
                                    <>
                                        {op.type === "filter" && (
                                            <div className="filter-controls">
                                                <select
                                                    value={op.field}
                                                    onChange={(e) =>
                                                        updateOperation(op.id, {
                                                            field: e.target
                                                                .value,
                                                        })
                                                    }
                                                    className="select"
                                                >
                                                    <option value="">
                                                        Select Field
                                                    </option>
                                                    {availableFields.map(
                                                        (field) => (
                                                            <option
                                                                key={
                                                                    field.value
                                                                }
                                                                value={
                                                                    field.value
                                                                }
                                                            >
                                                                {field.label} (
                                                                {field.type})
                                                            </option>
                                                        ),
                                                    )}
                                                </select>
                                                <select
                                                    value={op.operator}
                                                    onChange={(e) =>
                                                        updateOperation(op.id, {
                                                            operator:
                                                                e.target.value,
                                                        })
                                                    }
                                                    className="select"
                                                >
                                                    {operators
                                                        .filter(
                                                            (o) =>
                                                                ![
                                                                    "&&",
                                                                    "||",
                                                                ].includes(
                                                                    o.value,
                                                                ),
                                                        )
                                                        .map((operator) => (
                                                            <option
                                                                key={
                                                                    operator.value
                                                                }
                                                                value={
                                                                    operator.value
                                                                }
                                                            >
                                                                {operator.label}
                                                            </option>
                                                        ))}
                                                </select>
                                                <input
                                                    type="text"
                                                    placeholder="Value to compare"
                                                    value={op.value}
                                                    onChange={(e) =>
                                                        updateOperation(op.id, {
                                                            value: e.target
                                                                .value,
                                                        })
                                                    }
                                                    className="input"
                                                />
                                            </div>
                                        )}

                                        {op.type === "map" && (
                                            <div className="map-controls">
                                                <div className="map-controls__header">
                                                    <span className="map-controls__label">
                                                        Map Fields:
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            addMapField(op.id)
                                                        }
                                                        className="btn btn--accent btn--sm"
                                                    >
                                                        Add Field
                                                    </button>
                                                </div>
                                                {op.mapFields.map(
                                                    (field, fieldIndex) => (
                                                        <div
                                                            key={fieldIndex}
                                                            className="map-field"
                                                        >
                                                            <select
                                                                value={
                                                                    field.type
                                                                }
                                                                onChange={(e) =>
                                                                    updateMapField(
                                                                        op.id,
                                                                        fieldIndex,
                                                                        {
                                                                            type: e
                                                                                .target
                                                                                .value as MapField["type"],
                                                                        },
                                                                    )
                                                                }
                                                                className="select select--map-type"
                                                            >
                                                                <option value="copy">
                                                                    Copy Field
                                                                </option>
                                                                <option value="value">
                                                                    Set Value
                                                                </option>
                                                                <option value="transform">
                                                                    Transform
                                                                </option>
                                                            </select>

                                                            {field.type ===
                                                                "copy" && (
                                                                <>
                                                                    <select
                                                                        value={
                                                                            field.from
                                                                        }
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            updateMapField(
                                                                                op.id,
                                                                                fieldIndex,
                                                                                {
                                                                                    from: e
                                                                                        .target
                                                                                        .value,
                                                                                },
                                                                            )
                                                                        }
                                                                        className="select"
                                                                    >
                                                                        <option value="">
                                                                            Select
                                                                            source
                                                                            field
                                                                        </option>
                                                                        {availableFields.map(
                                                                            (
                                                                                f,
                                                                            ) => (
                                                                                <option
                                                                                    key={
                                                                                        f.value
                                                                                    }
                                                                                    value={
                                                                                        f.value
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        f.label
                                                                                    }
                                                                                </option>
                                                                            ),
                                                                        )}
                                                                    </select>
                                                                    <input
                                                                        type="text"
                                                                        placeholder="To field (optional)"
                                                                        value={
                                                                            field.to
                                                                        }
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            updateMapField(
                                                                                op.id,
                                                                                fieldIndex,
                                                                                {
                                                                                    to: e
                                                                                        .target
                                                                                        .value,
                                                                                },
                                                                            )
                                                                        }
                                                                        className="input"
                                                                    />
                                                                </>
                                                            )}

                                                            {field.type ===
                                                                "value" && (
                                                                <>
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Field name"
                                                                        value={
                                                                            field.to
                                                                        }
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            updateMapField(
                                                                                op.id,
                                                                                fieldIndex,
                                                                                {
                                                                                    to: e
                                                                                        .target
                                                                                        .value,
                                                                                },
                                                                            )
                                                                        }
                                                                        className="input"
                                                                    />
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Static value"
                                                                        value={
                                                                            field.value
                                                                        }
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            updateMapField(
                                                                                op.id,
                                                                                fieldIndex,
                                                                                {
                                                                                    value: e
                                                                                        .target
                                                                                        .value,
                                                                                },
                                                                            )
                                                                        }
                                                                        className="input"
                                                                    />
                                                                </>
                                                            )}

                                                            {field.type ===
                                                                "transform" && (
                                                                <>
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Field name"
                                                                        value={
                                                                            field.to
                                                                        }
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            updateMapField(
                                                                                op.id,
                                                                                fieldIndex,
                                                                                {
                                                                                    to: e
                                                                                        .target
                                                                                        .value,
                                                                                },
                                                                            )
                                                                        }
                                                                        className="input"
                                                                    />
                                                                    <input
                                                                        type="text"
                                                                        placeholder="item.field + 1"
                                                                        value={
                                                                            field.value
                                                                        }
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            updateMapField(
                                                                                op.id,
                                                                                fieldIndex,
                                                                                {
                                                                                    value: e
                                                                                        .target
                                                                                        .value,
                                                                                },
                                                                            )
                                                                        }
                                                                        className="input"
                                                                    />
                                                                </>
                                                            )}

                                                            <button
                                                                onClick={() =>
                                                                    removeMapField(
                                                                        op.id,
                                                                        fieldIndex,
                                                                    )
                                                                }
                                                                className="btn btn--danger btn--sm"
                                                            >
                                                                <Trash2
                                                                    size={16}
                                                                />
                                                            </button>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="custom-code">
                                        <label className="custom-code__label">
                                            Custom JavaScript Code:
                                        </label>
                                        <textarea
                                            value={op.customCode}
                                            onChange={(e) =>
                                                updateOperation(op.id, {
                                                    customCode: e.target.value,
                                                })
                                            }
                                            placeholder={
                                                op.type === "filter"
                                                    ? 'item.type === "text_field" && item.scope === "page"'
                                                    : '{ ...item, processed: true, newField: item.value + "_modified" }'
                                            }
                                            className="custom-code__textarea"
                                        />
                                    </div>
                                )}
                            </div>
                        ))}

                        <button
                            onClick={addOperation}
                            className="btn btn--secondary"
                        >
                            <Plus size={16} />
                            Add Operation
                        </button>
                    </div>
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
